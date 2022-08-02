import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api"
import { useCallback } from "react"
import { MdClose, MdCheck, MdOutlineCircle } from 'react-icons/md'

export default function Form({handleSubmit, form, setForm, button, isFilter}) {

  const handleTextField = (e) => {
    setForm((prevForm) => (
      {
        ...prevForm,
        [e.target.id]: e.target.value 
      }
    ))
    }
  
  const styleTextInput = `bg-gray-50 border border-gray-200 px-4 py-3 rounded-md w-full mt-1 font-normal text-gray-800`
  const styleTextLabel = `col-span-4 font-semibold `

  const triStateCheckbox = (label, id) => {
    const checkboxState = form[id]
    return (
      <div
        className={`
          rounded-md cursor-pointer overflow-hidden font-semibold items-center flex justify-between border pl-3 border-gray-200 col-span-4
          ${(checkboxState === null) && 'text-gray-400'}
          ${(checkboxState === true) && ''}
          ${(checkboxState === false) && ''}
          `}
        onClick={() => {
          if(checkboxState === null) setForm(prevForm => ({...prevForm, [id]: true}))
          if(checkboxState === true) setForm(prevForm => ({...prevForm, [id]: false}))
          if(checkboxState === false) setForm(prevForm => ({...prevForm, [id]: null}))
          }} 
      >
        <span>{label}</span>
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 border-l border-gray-200">
          {checkboxState === true && <MdCheck size={16} className="text-green-500" />}
          {checkboxState === false && <MdClose size={16} className="text-red-500" />}
          {checkboxState === null && <MdOutlineCircle size={16} className="text-gray-300" />}
        </div>
      </div>
    )
  }

  return (
  <form onSubmit={handleSubmit}
    className={`grid grid-cols-12 text-sm gap-x-6 gap-y-2 pt-6 ${isFilter && ''}`}>

      {
        (isFilter) &&
        <label className={styleTextLabel} htmlFor="globalatmid">
          Global ID
          <input className={styleTextInput} id='globalatmid' name='globalatmid' value={form.globalatmid} type='text' onChange={handleTextField} required={!isFilter} />
      </label>
      }

      <label className={styleTextLabel} htmlFor="atmreferencecode">
        Referans Kodu
        <input className={styleTextInput} id='atmreferencecode' name='atmreferencecode' value={form.atmreferencecode} type='text' onChange={handleTextField} required={!isFilter} />
      </label>

      <label className={styleTextLabel} htmlFor="atmname">
        Atm İsmi
        <input className={styleTextInput} id='atmname' name='atmname' value={form.atmname} type='text' onChange={handleTextField} required={!isFilter}/>
      </label>

      {
        (!isFilter) &&
        <label className={styleTextLabel} htmlFor="atmage">
          Faaliyet Başlangıç Tarihi
          <input className={styleTextInput} id='atmage' name='atmage' value={form.atmage} type='date' onChange={handleTextField} />
      </label>
      }
      
<hr className="col-span-12 my-3 -mx-6"/>

      {triStateCheckbox("Şube ATM'si" ,"servicedependency")}
      {triStateCheckbox("Sınırlı Hizmet" ,"restrictedatm")}
      {triStateCheckbox("Havaalanı" ,"airportlocated")}
      {triStateCheckbox("Alışveriş Merkezi" ,"malllocated")}
      {triStateCheckbox("Üniversite" ,"universitylocated")}
      {triStateCheckbox("Para Yatırma" ,"depositflag")}
      {triStateCheckbox("Para Çekme" ,"withdrawflag")}
      {triStateCheckbox("Bozuk Para" ,"terminalcoinoperator")}
      {triStateCheckbox("NFC" ,"nfcflag")}
      {triStateCheckbox("Biyometri" ,"biometryflag")}
      {triStateCheckbox("Görme Engelli" ,"visuallyimpairedflag")}
      {triStateCheckbox("Bedensel Engelli" ,"orthopedicdisabledflag")}

<hr className="col-span-12 my-3 -mx-6"/>

      <label className={styleTextLabel} htmlFor="licensetag">
        İl
        <input className={styleTextInput} id='licensetag' name='licensetag' value={form.licensetag} type='text' onChange={handleTextField} />
      </label>

      <label className={styleTextLabel} htmlFor="district">
        İlçe
        <input className={styleTextInput} id='district' name='district' value={form.district} type='text' onChange={handleTextField} />
      </label>

      <label className={styleTextLabel} htmlFor="neighborhood">
        Mahalle
        <input className={styleTextInput} id='neighborhood' name='neighborhood' value={form.neighborhood} type='text' onChange={handleTextField} />
      </label>

      {
        (!isFilter) &&
        <>
        <label className={`col-span-12 font-semibold`} htmlFor="adress">
          Adres
          <input className={styleTextInput} id='adress' name='adress' value={form.adress} type='text' onChange={handleTextField} />
        </label>

        <FormMap form={form} setForm={setForm} />

        <label className={`col-span-6 font-semibold`} htmlFor="adress">
          Enlem
          <input className={styleTextInput} id='geocodelatitude' name='geocodelatitude' value={form.geocodelatitude} type='text' onChange={handleTextField} />
        </label>

        <label className={`col-span-6 font-semibold`} htmlFor="adress">
          Boylam
          <input className={styleTextInput} id='geocodelongitude' name='geocodelongitude' value={form.geocodelongitude} type='text' onChange={handleTextField} />
        </label>
        </>
      }

<hr className="col-span-12 my-4 -mx-6"/>

      <button 
      type="submit"
      className="col-span-12 py-3 text-xl font-bold text-center text-white bg-blue-600 rounded-xl">
          {button}
      </button>

  </form>
)
}

function FormMap({form, setForm}) {
  const {isLoaded} = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS })
  const point = { lat: Number(form.geocodelatitude) , lng: Number(form.geocodelongitude) }
  
  const setDecimals = (number, decimals) => {
    return (Math.round(number * 10**decimals) / 10**decimals).toFixed(decimals)
  }

  const setFormPoint = useCallback((e) => {
    setForm((prev) => (
      {
        ...prev,
        geocodelatitude: setDecimals(e.latLng.lat(), 6),
        geocodelongitude: setDecimals(e.latLng.lng(), 6),
      }
    ));
    // eslint-disable-next-line
  }, [])
  
  if (!isLoaded) return <div>Harita yükleniyor...</div>
  return (
    <GoogleMap
      zoom={(point.lat && point.lng) ? 13 : 5}
      center={(point.lat && point.lng) ? point : { lat: 39, lng: 36}}
      mapContainerClassName='w-full cursor-pointer col-span-12 h-[300px] mt-6 mb-4 rounded-lg shadow-md border border-gray-200'
      onClick={setFormPoint}
    >
      <MarkerF position={point} />
    </GoogleMap>
  )
}