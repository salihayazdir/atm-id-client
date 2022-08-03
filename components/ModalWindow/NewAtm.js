import { useState, useContext } from "react"
import Modal from "./Modal";
import Form from "../Form"
import axios from "axios";
import { useAuthState, useAuthDispatch } from "../Context/MemberContext";

export default function NewAtm({setModal}) {

  const state = useAuthState();
  const memberno = state.user.memberno;
  
  const [form, setForm] = useState({
    "memberno": memberno,
    "atmreferencecode": null,
    "atmname": null,
    "licensetag": null,
    "adress": null,
    "district": null,
    "neighborhood": null,
    "servicedependency": null,
    "restrictedatm": false,
    "airportlocated": null,
    "malllocated": null,
    "universitylocated": null,
    "depositflag": true,
    "withdrawflag": true,
    "terminalcoinoperator": null,
    "nfcflag": true,
    "biometryflag": null,
    "visuallyimpairedflag": null,
    "orthopedicdisabledflag": null,
    "atmage": null,
    "geocodelatitude": null,
    "geocodelongitude": null
  })
  const [formState, setFormState] = useState({status: '', message: ''})

  const addAtm = async (e) => {
      e.preventDefault();
      setFormState({status: 'loading', message: 'Gönderiliyor...'});
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/atm`, form)
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
    if (formState.status === 'ok') {
      window.location.reload(false)
    } else {
      setFormState({});
    }
  }

  return (
  <Modal
  title='ATM Ekle'
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

    <Form 
      handleSubmit={addAtm}
      button='ATM Ekle'
      form={form}
      setForm={setForm}
    />
  
  </Modal>
  )
}