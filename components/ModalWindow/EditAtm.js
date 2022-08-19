import { useState } from "react"
import Modal from "./Modal";
import Form from "../Form"
import axios from "axios";

export default function EditAtm({data, modal, setModal, fetchAtms}) {
  
    const atm = data.filter((atm) => atm.globalatmid === modal)[0]
    const [form, setForm] = useState(atm)
    const [formState, setFormState] = useState({status: '', message: ''})

    const editAtm = async (e) => {
        e.preventDefault();
        setFormState({status: 'loading', message: 'Gönderiliyor...'});
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/atm/${modal}`, form)
            .then(res => {
                if (res.data.success === true) {
                    setFormState({status: 'ok', message: res.data.message})}
                if (res.data.success === false) {
                    setFormState({status: 'err', message: res.data.message})}
            })
            .catch(err => {
                console.error(err);
                setFormState({status: 'err', message: `Sunucuya bağlanılamadı. ${err}`})
              })
        }

    const deleteAtm = async (e) => {
        e.preventDefault();
        setFormState({status: 'loading', message: 'Gönderiliyor...'});
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/atm/${modal}`)
        .then(res => {
            if (res.data.success === true) {
                setFormState({status: 'ok', message: res.data.message})}
            if (res.data.success === false) {
                setFormState({status: 'err', message: res.data.message})}
        })
        .catch(err => {
            console.error(err);
            setFormState({status: 'err', message: `Sunucuya bağlanılamadı. ${err}`})
          })
        }
        
    const handleStatusModal = () => {
        setFormState(prev => ({status: '', message:''}));
        if (formState.status === 'ok') {
            fetchAtms()
            setModal(null)
        }
        }
  
    return (
    <Modal
    title='ATM Güncelle'
    setModal={setModal}
    >
        {
        (formState.status)
        &&
        (
            <div className="fixed top-0 left-0 z-50 w-screen h-full">
            <div className='fixed h-full w-screen top-0 left-0 backdrop-blur-[5px] bg-slate-500/30'></div>
            <div
            className="fixed flex justify-between top-40 p-8 mb-24 bg-white left-0 w-[70vw] ml-[15vw] top-30 rounded-lg shadow-2xl ">
                <h3
                className="text-lg">
                {formState.message}
                </h3>
                {
                (formState.status !== 'loading')
                &&
                (
                    <button
                    onClick={handleStatusModal}
                    className="px-10 py-4 font-bold tracking-wide rounded-md bg-slate-200">
                    {(formState.status === 'ok') ? 'Tamam' : 'Tekrar Dene'}
                    </button>
                )
                }
            </div>
            </div>
        )
        }
        <h2 
            className="px-6 py-4 -mx-6 text-xl font-semibold text-blue-600 border-b border-gray-200 bg-gray-50">
            {`Global ID: ${atm.globalatmid}`}
        </h2>
        <Form 
        handleSubmit={editAtm}
        button='Güncelle'
        form={form}
        setForm={setForm}
        />
        <button 
        onClick={deleteAtm}
        className="block w-full py-4 mt-6 text-xl font-bold text-center text-white bg-red-200 hover:bg-red-500 rounded-xl">
        Sil
        </button>
    </Modal>
    )
}