import { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { FaRegEdit, FaCheck,  } from 'react-icons/fa';

export default function DataTable({setModal, data, apiState}) {

  const booleanCellProps = (
    props => props.value === true && ( <FaCheck size={16} className='mx-auto' />)
  )
  
  const columns = useMemo(() => [
    { Header: "ID", accessor: "globalatmid" },
    { Header: "Banka", accessor: "memberno" },
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
        Cell: ({row}) => (
          <button onClick={() => setModal(row.values.globalatmid)}
            className='inline-flex items-center gap-2 px-2 py-1 -mx-6 bg-gray-100 rounded-md'>
            <FaRegEdit size={16} className='text-blue-600'/>
            <span className='font-semibold text-gray-700'>Düzenle</span>
          </button>
        )
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
            {headerGroups.map((headerGroup) => {
              return (
                <tr {...headerGroup.getHeaderGroupProps()}>
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
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}
                  className='border-gray-200 border-y'>
                    {
                      row.cells.map(cell => {
                        return (
                          <td {...cell.getCellProps()}
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