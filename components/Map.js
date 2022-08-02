import { useMemo, useState } from "react"
import { GoogleMap, useLoadScript, InfoWindow, MarkerF } from "@react-google-maps/api"
import usePlacesAutocomplete, { getGeocode, getLatLng} from "use-places-autocomplete"

function Map({data, setModal}) {
  
    const [selectedAtm, setSelectedAtm] = useState(null)

    const {isLoaded} = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS })
    const center = useMemo(() => ({ lat: 40.994871, lng: 29.143319}), [])

    const markers = useMemo(() => data.map((atm, i) => {
        if (!atm.geocodelatitude) return
        else {
            return <MarkerF position={{
                lat: Number(atm.geocodelatitude),
                lng: Number(atm.geocodelongitude)}}
                key={i}
                onClick={() => setSelectedAtm({...atm})} />
        }
    }), [data])

    if (!isLoaded) return <div>Harita yükleniyor...</div>
    return (
        <GoogleMap
            zoom={9}
            center={center}
            mapContainerClassName='w-full h-[450px] rounded-lg shadow-md border border-gray-200'
        >
            {markers}
            {
                selectedAtm && (
                    <InfoWindow
                        position={{
                            lat: Number(selectedAtm.geocodelatitude),
                             lng: Number(selectedAtm.geocodelongitude)}}
                        onCloseClick={() => setSelectedAtm(null) }
                    >
                        <div className="flex flex-col gap-3">
                            <h2>
                                <span className="font-semibold">Global ID : </span>
                                <span>{selectedAtm.globalatmid}</span>
                            </h2>
                        <hr className="-my-1"/>
                            <div>
                                <span className="font-semibold">Referans Kodu : </span>
                                <span>{selectedAtm.atmreferencecode}</span>
                            </div>
                        <hr className="-my-1"/>
                            <div>
                                <span className="font-semibold">İsim : </span>
                                <span>{selectedAtm.atmname}</span>
                            </div>
                        <hr className="-my-1"/>
                            <div>
                                <span className="font-semibold">Banka : </span>
                                <span>{selectedAtm.memberno}</span>
                            </div>
                        <hr className="-my-1"/>
                            <button
                                onClick={() => setModal(selectedAtm.globalatmid)}
                                className='py-2 font-semibold tracking-wide text-blue-600 bg-gray-100 rounded-md'
                            >
                                Düzenle
                            </button>
                        </div>
                    </InfoWindow>
                )
            }
        </GoogleMap>
    )
}

export default Map