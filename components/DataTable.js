import { useMemo } from 'react';
import { useAuthState } from '../components/Context/MemberContext';
import { useTable, useSortBy } from 'react-table';
import { FaRegEdit, FaCheck,  } from 'react-icons/fa';

export default function DataTable({setModal, data, apiState}) {

  const globalState = useAuthState();
  const { memberno } = globalState.user;

  const booleanCellProps = (
    props => props.value === true && ( <FaCheck size={16} className='mx-auto' />)
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
    <div className='block max-w-full mb-20 overflow-x-auto'>
      {(apiState === 'loading') && <div>Sunucuya bağlanılıyor...</div>}
      {(apiState === 'error') && <div>Sunucuya bağlanılamadı.</div>}
      {(apiState === 'success') && (
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
    </div>
  )
}