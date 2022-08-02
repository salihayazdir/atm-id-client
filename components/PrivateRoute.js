import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthState, useAuthDispatch } from './Context/MemberContext';

export default function PrivateRoute({ children }) {
  
    const router = useRouter();

    const {authorized, loading, user} = useAuthState();
    const dispatch = useAuthDispatch();

    const protectedRoutes = [
        '/',
    ]


    const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1;

    useEffect(() => {
        if (!loading && !authorized && pathIsProtected) {
        router.push('/login');
        }
    }, [loading, authorized, pathIsProtected]);

    if ((loading || !authorized) && pathIsProtected) {
        return (
            <div
            className='fixed z-10 w-screen h-screen backdrop-blur-[2px] bg-[#f9fafb]'>
            </div>
        )
    }

  return children;
}