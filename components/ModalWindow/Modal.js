import {IoClose} from 'react-icons/io5'

export default function Modal({title, setModal, children}) { 
  return (
  <>
  <div className='fixed z-10 w-full h-full backdrop-blur-[2px] bg-slate-500/30'>
  </div>
  <div className="z-20 absolute left-0 w-[70vw] ml-[15vw] top-10">
    <div className="p-6 mb-24 bg-white rounded-lg shadow-2xl">
      <button
        className="absolute right-4 top-4"
        onClick={() => setModal(null)}>
        <IoClose size={26} className='hover:opacity-50' />
      </button>
      <div className="text-3xl font-bold">
        <h1>{title}</h1>
        <hr className="mt-6 -mx-6"/>
      </div>

      {children}

    </div>
  </div>
  </>
  )
}