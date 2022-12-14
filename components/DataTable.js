import { useMemo } from 'react';
import { useAuthState } from '../components/Context/MemberContext';
import { useTable, useSortBy } from 'react-table';
import { FaRegEdit } from 'react-icons/fa';
import { MdClose, MdCheck, MdOutlineCircle } from 'react-icons/md'
import Loader from './Loader';

export default function DataTable({setModal, data, apiState}) {

  const globalState = useAuthState();
  const { memberno } = globalState.user;

  const booleanCellProps = (props => {
    if (props.value === true) return ( <MdCheck size={20} className='mx-auto text-green-500' />)
    if (props.value === false) return ( <MdClose size={18} className='mx-auto text-red-500' />)
    if (props.value === null) return ( <MdOutlineCircle size={18} className='mx-auto text-gray-200' />)
  }
  )

  const bankCellProps = (
    props => {
      const membersList = JSON.parse(localStorage.getItem('members_list'))
      const memberInfo = membersList.filter((member) => props.value === member.id)[0]
      return (
        <div className='inline-flex items-center gap-2'>
          <img src={memberInfo.logomark}
              className='w-10 h-10 border border-gray-200 rounded-md' />
          <span>{memberInfo.bankname}</span>
        </div>
      )
    }
  )
  
  const columns = useMemo(() => [
    { Header: "ID", accessor: "globalatmid" },
    { Header: "Banka", accessor: "memberno", Cell: bankCellProps },
    { Header: "Referans Kodu", accessor: "atmreferencecode" },
    { Header: "İsim", accessor: "atmname" },
    { Header: "İl Kodu", accessor: "licensetag" },
    { Header: "Adres", accessor: "adress" },
    { Header: "İlçe", accessor: "district" },
    { Header: "Semt / Mahalle", accessor: "neighborhood" },
    { Header: "Şube ATM'si", accessor: "servicedependency", Cell: booleanCellProps },
    { Header: "Hizmet Kısıtlaması", accessor: "restrictedatm", Cell: booleanCellProps },
    { Header: "Havaalanı", accessor: "airportlocated", Cell: booleanCellProps },
    { Header: "Alışveriş Merkezi", accessor: "malllocated", Cell: booleanCellProps },
    { Header: "Üniversite", accessor: "universitylocated", Cell: booleanCellProps },
    { Header: "Para Yatırma", accessor: "depositflag", Cell: booleanCellProps },
    { Header: "Para Çekme", accessor: "withdrawflag", Cell: booleanCellProps },
    { Header: "Bozuk Para", accessor: "terminalcoinoperator", Cell: booleanCellProps },
    { Header: "NFC", accessor: "nfcflag", Cell: booleanCellProps },
    { Header: "Biyometri", accessor: "biometryflag", Cell: booleanCellProps },
    { Header: "Görme Engelliler", accessor: "visuallyimpairedflag", Cell: booleanCellProps },
    { Header: "Bedensel Engelliler", accessor: "orthopedicdisabledflag", Cell: booleanCellProps },
    { Header: "Faaliyet Başlangıcı", accessor: "atmage"},
    { Header: "Konum (enlem)", accessor: "geocodelatitude" },
    { Header: "Konum (boylam)", accessor: "geocodelongitude" },
  ], []);
  
  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      {
        id: "edit",
        Header: "",
        Cell: ({row}) => {
          if (row.values.memberno === memberno) {
            return (
              <button onClick={() => setModal(row.values.globalatmid)}
                className='inline-flex items-center gap-2 px-2 py-1 -mx-6 bg-gray-100 rounded-md'>
                <FaRegEdit size={16} className='text-blue-600'/>
                <span className='font-semibold text-gray-700'>Düzenle</span>
              </button>
            )
          }
        }
      },
      ...columns,
    ])
  };

  const tableInstance = useTable(
    { columns, data },
    tableHooks,
    useSortBy,
  );
  
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <div className={`block max-w-full mb-6 overflow-x-auto`}>

      {(apiState === 'success' && Boolean(data.length)) && (
        <table {...getTableProps()}
          className='border-collapse border-gray-200 rounded-lg border-y'>
          <thead
            className='bg-gray-50 '>
            {headerGroups.map((headerGroup, i) => {
              return (
                <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {
                  headerGroup.headers.map((column, i) => {
                    return (
                      <th key={i} {...column.getHeaderProps()}
                        className='px-12 py-4 font-semibold text-left align-bottom whitespace-nowrap'>
                        {column.render("Header")}
                      </th>
                    )
                  })
                }
              </tr>
              )
            })}
          </thead>
          <tbody {...getTableBodyProps()}
          className='text-gray-800'>
            {
              rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr key={i} {...row.getRowProps()}
                  className='border-gray-200 border-y'>
                    {
                      row.cells.map((cell, i) => {
                        return (
                          <td key={i} {...cell.getCellProps()}
                          className='px-12 py-3'>
                            { cell.render("Cell") }
                          </td>
                        )
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      )}
      
      {((data.length === 0) && (apiState === 'success')) &&
        <div className='flex items-center justify-center p-6 font-semibold text-gray-400 bg-gray-100'>
          Sonuç bulunamadı.
        </div>}

      {(apiState === 'loading') && 
        <Loader text='Yükleniyor...' 
          svgStyles="inline w-6 h-6 mr-4 text-gray-400 animate-spin"
          containerStyles='p-6 bg-gray-100 text-gray-400 font-semibold flex justify-center items-center' />}

      {(apiState === 'error') &&
        <div className='flex items-center justify-center p-6 font-semibold text-red-400 bg-gray-100'>
          Bağlantı Hatası
        </div>}
      
    </div>
  )
}