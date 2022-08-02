import Head from 'next/head'
import { useState, useEffect, useMemo } from "react"
import axios from 'axios';
import DataTable from '../components/DataTable';
import UserInfo from '../components/UserInfo';
import {FaRegPlusSquare} from 'react-icons/fa';
import {MdFilterAlt} from 'react-icons/md';
import {IoMdTrash} from 'react-icons/io';
import EditAtm from '../components/modalWindow/EditAtm';
import NewAtm from '../components/modalWindow/NewAtm';
import Filter from '../components/Filter';
import Map from '../components/Map';


export default function Home() {

  const [atms, setAtms] = useState([]);
  const [apiState, setApiState] = useState('');
  
  const [modal, setModal] = useState(null);

  const nullObject = {
    "memberno": null,
    "atmreferencecode": null,
    "atmname": null,
    "licensetag": null,
    "adress": null,
    "district": null,
    "neighborhood": null,
    "servicedependency": null,
    "restrictedatm": null,
    "airportlocated": null,
    "malllocated": null,
    "universitylocated": null,
    "depositflag": null,
    "withdrawflag": null,
    "terminalcoinoperator": null,
    "nfcflag": null,
    "biometryflag": null,
    "visuallyimpairedflag": null,
    "orthopedicdisabledflag": null,
    "atmage": null,
    "geocodelatitude": null,
    "geocodelongitude": null
  }
  const [filters, setFilters] = useState(nullObject);
  const [filterDropdown, setFilterDropdown] = useState(false);

  const [pagination, setPagination] = useState({offset: 0, limit: 0});

  useEffect(() => { fetchAtms(); }, []);
  const data = useMemo(() => [...atms], [atms] );

  const fetchAtms = async (params) => {
    setApiState('loading')
    const res = await axios.get(process.env.NEXT_PUBLIC_API_URL,
      {params: {...params, offset: pagination.offset, ...(pagination.limit && {limit: pagination.limit})}}
      )
      .catch(err => {
        console.error(err);
        setApiState('error')
      });
      if(res) {
      console.log('fetched')
      setAtms(res.data);
      setApiState('success')
    }
  }

  const getFilteredResults = () => {
    setFilterDropdown(false);
    fetchAtms(filters);
  }

  const clearFilters = () => {
    setFilters(nullObject);
    setFilterDropdown(false);
    fetchAtms();
  }

  return (
  <>
  {modal && (<>
    {(modal === 'new') ? 
    (<NewAtm
      setModal={setModal}
    />)
    :
    (<EditAtm
      modal={modal}
      setModal={setModal}
      data={data}
    />)
    }
  </>)}
  
  <div className='flex flex-col gap-6 px-12 py-6'>
    <div className='flex items-center justify-between '>
      <span className='text-4xl font-bold text-gray-700'>LOGO</span>
      <UserInfo />
    </div>
    <Map data={data} setModal={setModal} />
    <div className='text-xs bg-white border border-gray-200 rounded-lg shadow-md '>
      <div className='flex justify-between gap-4 p-6'>
        <div className='flex gap-4'>
          <button
            onClick={() => setFilterDropdown((prev) => !prev)} 
            className={`relative inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 border rounded-md
            ${filterDropdown ? 'border-blue-600' : 'border-gray-300'}`}>
            <MdFilterAlt size={18}/>
            Filtreler
          </button>
          {filterDropdown &&
            <Filter
              filters={filters}
              setFilters={setFilters}
              setFilterDropdown={setFilterDropdown}
              getFilteredResults={getFilteredResults}
            />}
          {(Object.values(filters).filter(value => value !== null).length) ?
            <button
              className='inline-flex items-center self-end gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-00'
              onClick={clearFilters}>
              <IoMdTrash size={18} />
              Temizle
            </button> : null
          }
        </div>
        <button
          onClick={() => setModal('new')} 
          className='inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-100 bg-blue-600 rounded-md'>
          <FaRegPlusSquare size={18}/>
          Yeni ATM
        </button>
      </div>
      <DataTable
        setModal={setModal}
        data={data}
        apiState={apiState} />
    </div>
  </div>
  </>
  )
}