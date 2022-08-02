import { useEffect, useState } from "react";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useAuthState, useAuthDispatch } from "../components/Context/MemberContext";
import { useRouter } from "next/router";
import { MdArrowForward, MdOutlineInfo } from 'react-icons/md';

export default function Login() {
  const { authenticated, authorized, user } = useAuthState();
  const dispatch = useAuthDispatch();

  const [loginForm, setLoginForm] = useState({email: ''});
  const [otpForm, setOtpForm] = useState('');
  const [apiState, setApiState] = useState({loading: false, error: ''})
  
  const router = useRouter();

  useEffect(() => {
    if (authorized && authenticated) {
      router.push('/')
    };
  }, [authorized])
  

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
    await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`, loginForm)
      .then(res => {
        console.log(res);
        if (res.data.success) {
          dispatch('LOGIN')
          dispatch('POPULATE', res.data.user)
          setApiState(prev => ({...prev, error: ''}))
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

    await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/token`,
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
              <div>
                <svg aria-hidden="true" role="status" className="inline w-6 h-6 mr-4 text-gray-400 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#ffffff"/>
                </svg>
                Gönderiliyor...
              </div>
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
                <div>
                  <svg aria-hidden="true" role="status" className="inline w-6 h-6 mr-4 text-gray-400 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#ffffff"/>
                  </svg>
                  Gönderiliyor...
                </div>
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