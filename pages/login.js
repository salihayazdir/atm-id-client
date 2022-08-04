import { useEffect, useState } from "react";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useAuthState, useAuthDispatch } from "../components/Context/MemberContext";
import { useRouter } from "next/router";
import { MdArrowForward, MdOutlineInfo } from 'react-icons/md';
import Loader from "../components/Loader";

export default function Login() {
  const { authenticated, authorized, user } = useAuthState();
  const dispatch = useAuthDispatch();

  const [loginForm, setLoginForm] = useState({email: 'atmidproject@gmail.com'});
  const [otpForm, setOtpForm] = useState('');
  const [apiState, setApiState] = useState({loading: false, error: ''})
  
  const router = useRouter();

  useEffect(() => {
    if (authorized && authenticated) {
      router.push('/')
    };
    // eslint-disable-next-line
  }, [authorized])

  const saveMembersData = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/members`)
      .then(res => {
        if (!res.data.success) throw res.data.message;
        localStorage.setItem('members_list', JSON.stringify(res.data.data))
      })
      .catch(err => {
        console.error(err);
      })
  }

  const handleLoginFormInput = (e) => {
    setLoginForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  };

  const submitLoginForm = async (e) => {
    e.preventDefault()
    setApiState(prev => ({...prev, loading: true}) )
    console.log(apiState)
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, loginForm)
      .then(res => {
        console.log(res);
        setOtpForm(res.data.code);
        if (res.data.success) {
          dispatch('LOGIN');
          dispatch('POPULATE_USER', res.data.user);
          setApiState(prev => ({...prev, error: ''}));
          saveMembersData();
        } else {
          throw res.data.message
        };
      })
      .catch(err => {
        console.error(err);
        setApiState(prev => ({...prev, error: err}) )
        dispatch('LOGOUT');
      })

      setApiState(prev => ({...prev, loading: false}) )
  };

  const submitOtpForm = async (e) => {
    e.preventDefault();
    setApiState(prev => ({...prev, loading: true}) )

    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/token`,
    { email: loginForm.email, code: otpForm})
      .then(res => {
        console.log(res);
        if (res.data.success) {
          setCookie('access_token', res.data.access_token)
          dispatch('AUTHORIZE')
        } else {
          throw res.data.message
        }
        ;
      })
      .catch(err => {
        console.error(err);
        setApiState(prev => ({...prev, error: err}) )
      })

      setApiState(prev => ({...prev, loading: false}) )
  }; 

  const handleOtpFormInput = (e) => {
    setOtpForm(e.target.value)
  };

  return (
  <>
  <div className="max-w-[500px] mx-auto mt-32 border border-gray-200 px-8 pt-5 pb-10 rounded-lg shadow-sm bg-white">
    <h1 className="text-2xl font-bold text-center">Giriş Yap</h1>
    <hr className="mt-4 -mx-8"/>
    { 
      (!authenticated && !authorized)
      &&
      (
      <form onSubmit={submitLoginForm}
      className='flex flex-col mt-10 text-lg'>
        {/* <label className="mb-2 text-slate-500">E-posta Adresiniz</label> */}
        <div className="relative flex">
          <input
          onChange={handleLoginFormInput} value={loginForm.email} id='email' name='email' type='email' placeholder=" " required
          className="block w-full px-6 py-4 text-lg text-gray-900 bg-transparent border rounded-lg appearance-none border-slate-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <label
          htmlFor="email"
          className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-6 peer-focus:px-6 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
            E-posta Adresiniz
          </label>
        </div>
        <div className="inline-flex px-4 py-3 mt-4 text-sm text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
          <MdOutlineInfo size={35} className='mr-4'/>
          <span>6 haneli doğrulama kodu içeren bir e-posta alacaksınız.</span>
        </div>

        <button
        type='submit' disabled={apiState.loading}
        className={`inline-flex items-center justify-center px-6 py-4 mt-10 text-lg font-bold text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300
        ${apiState.loading && 'bg-gray-500 border border-gray-200 font-normal text-gray-300 hover:bg-gray-500 '}`}>
          {
            (apiState.loading)
            ?
            (
              <Loader text='Gönderiliyor...' 
                  svgStyles="inline w-6 h-6 mr-4 text-gray-400 animate-spin"
                  containerStyles='' />
            )
            :
            (
              <div className="inline-flex">
                İlerle <MdArrowForward size={28} className='ml-2'/>
              </div>
            )
          }
        </button>

      </form>
      )
    }
    {
      (authenticated && !authorized)
      &&
      (
        <form onSubmit={submitOtpForm}
        className='flex flex-col mt-10 text-lg'>
          <div className="relative flex">
            <input 
            onChange={handleOtpFormInput} value={otpForm} id='code' name='code' type='text' placeholder=" " required
            className="block w-full px-6 py-4 text-lg text-gray-900 bg-transparent border rounded-lg appearance-none border-slate-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label
            htmlFor="code"
            className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white px-6 peer-focus:px-6 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
              Doğrulama Kodu
            </label>
          </div>
          <div className="inline-flex px-4 py-3 mt-4 text-sm text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
            <MdOutlineInfo size={35} className='mr-4'/>
            <span>
              {`${loginForm.email} adresine gönderilen doğrulama kodunuzu 3 dakika içerisinde kullanmalısınız.`}
            </span>
          </div>
          <button
          type='submit' disabled={apiState.loading}
          className={`inline-flex items-center justify-center px-6 py-4 mt-10 text-lg font-bold text-center text-white bg-[#00dc80] hover:bg-[#00c271] rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300
          ${apiState.loading && 'bg-gray-500 border border-gray-200 font-normal text-gray-300 hover:bg-gray-500'}`}>
            {
              (apiState.loading)
              ?
              (
                <Loader text='Gönderiliyor...' 
                  svgStyles="inline w-6 h-6 mr-4 text-gray-400 animate-spin"
                  containerStyles='text-white' />
              )
              :
              (
                <div className="inline-flex">
                  Giriş Yap <MdArrowForward size={28} className='ml-2'/>
                </div>
              )
            }
          </button>
        </form>
      )
    }
    {
      (!apiState.loading) && (apiState.error)
      &&
      (
        <div className="px-4 py-2 mt-4 text-white bg-red-500 rounded-md">
          {`! ${apiState.error}`}
        </div>
      )
    }

  </div>
  </>
  )
}