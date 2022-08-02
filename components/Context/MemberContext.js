import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { useContext, createContext, useEffect, useReducer } from "react";
import axios from "axios";

const StateContext = createContext({
    user: {
        id: null,
        memberno: null,
        email: null,
        name: null,
      },
    authenticated: false,
    authorized: false,
    loading: true,
});

const DispatchContext = createContext(null);

const reducer = (state, {type,payload}) => {
    switch (type){
        case 'LOGIN' :
            return {
                ...state,
                authenticated: true,
            };
        case 'AUTHORIZE' :
            console.log('authorized');
            return ({
                ...state,
                authenticated: true,
                authorized: true,
            });
        case 'LOGOUT':
            console.log('logged out')
            deleteCookie('access_token');
            deleteCookie('userinfo')
            return {
                ...state,
                authenticated: false,
                authorized: false,
                user: {}
            };
        case 'POPULATE':
            setCookie('userinfo', JSON.stringify(payload))
            return {
                ...state,
                user: payload,
            };
        case 'STOP_LOADING':
            return {
                ...state,
                loading: false,
            };
        default:
            throw new Error (`Unknown Action: ${type}`)
    }
}

const AuthProvider = ({ children }) => {
    const [state, defaultDispatch] = useReducer(reducer, {
        user: {
            id: null,
            memberno: null,
            email: null,
            name: null,
          },
        authenticated: false,
        authorized: false,
        loading: true,
    })

    const dispatch = (type, payload) => defaultDispatch({type, payload});

    useEffect(() => {
        const loadUser = async () => {
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/account`)
                    .then(res => {
                        if (res.data.success) {
                            dispatch('AUTHORIZE');
                            dispatch('POPULATE', JSON.parse(getCookie('userinfo')))
                        } else {
                            dispatch('LOGOUT');
                        };
                    })
                    .catch(err => {
                        console.error(err);
                    })
            } catch (err) {
                console.error(err)
            } finally {
                dispatch('STOP_LOADING');
            }
        };
        loadUser();
    }, [state.check])
    
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
export {AuthProvider}