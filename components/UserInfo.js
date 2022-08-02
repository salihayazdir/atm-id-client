import { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdPerson } from 'react-icons/md';
import { useAuthState } from '../components/Context/MemberContext';

function UserInfo() {
  
    const [userDropdown, setUserDropdown] = useState(false)

    const globalState = useAuthState();
    const { memberno, email, name, id} = globalState.user;
  
    return (
      <div
        onClick={() => setUserDropdown((prev) => !prev)}
        className={`bg-gray-100 text-sm z-[9] relative w-48   self-end border-gray-200 border
        ${userDropdown ? 'rounded-t-lg text-gray-800' : 'rounded-lg text-gray-600'} `}>
        <div className='flex items-center justify-between px-4 py-3'>
            <div className='flex items-center gap-2'>
                <MdPerson size={24}/>
                <span className='font-semibold'>{name}</span>
            </div>
            {userDropdown ? <MdKeyboardArrowUp size={20}/> : <MdKeyboardArrowDown size={20}/>}
        </div>
        {userDropdown &&
        <div
            className='absolute p-4 -ml-[1px] bg-gray-100 border border-t-0 rounded-b-lg shadow-xl w-48'>
            <hr className='mb-2 -mt-4'/>
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
        </div>}
      </div>
    )
}

export default UserInfo