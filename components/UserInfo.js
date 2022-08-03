import { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdPerson } from 'react-icons/md';
import { useAuthState, useAuthDispatch } from '../components/Context/MemberContext';

function UserInfo() {
  
    const [userDropdown, setUserDropdown] = useState(false)

    const globalState = useAuthState();
    const dispatch = useAuthDispatch();
    const { memberno, email, name, id} = globalState.user;

    const membersList = JSON.parse(localStorage.getItem('members_list'))
    const memberInfo = membersList.filter((member) => memberno === member.id)[0]

    return (
      <div
        className={`bg-gray-100 text-sm z-[9] relative w-52 self-end border
        ${userDropdown ? 'rounded-t-lg border-gray-300 text-gray-800' : 'rounded-lg border-gray-200 text-gray-600'} `}>
        <div
            onClick={() => setUserDropdown((prev) => !prev)}
            className='flex items-center justify-between px-4 py-3 cursor-pointer'>
            <div className='flex items-center gap-2'>
                <MdPerson size={24}/>
                <span className='font-semibold'>{name}</span>
            </div>
            {userDropdown ? <MdKeyboardArrowUp size={20}/> : <MdKeyboardArrowDown size={20}/>}
        </div>
        {userDropdown &&
        <div
            className='absolute p-4 -ml-[1px] bg-gray-100  border-gray-300 border border-t-0 rounded-b-lg shadow-xl w-52'>
            <hr className='mb-3 -mx-4 -mt-4 border-gray-300'/>
            <div className='inline-flex items-center gap-2 font-semibold'>
                <img src={memberInfo.logomark}
                    className='w-10 h-10 border border-gray-200 rounded-md' />
                <span>{memberInfo.bankname}</span>
            </div>
            <hr className='my-2'/>
            <div>
                <span className='font-semibold'>Banka ID: </span>
                <span>{memberno}</span>
            </div>
            <hr className='my-2'/>
            <div>
                <span className='font-semibold'>Kullanıcı ID: </span>
                <span>{id}</span>
            </div>
            <hr className='my-2'/>
            <div>
                <span className='font-semibold'>Eposta: </span>
                <span>{email}</span>
            </div>
            <button
                onClick={() => dispatch('LOGOUT')}
                className='w-full p-2 mt-4 font-semibold text-gray-100 bg-gray-600 rounded-md'>
                Çıkış Yap
            </button>
        </div>}
      </div>
    )
}

export default UserInfo