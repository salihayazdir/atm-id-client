import Form from './Form';
import { MdClear } from 'react-icons/md'

function Filter({filters, setFilters, getFilteredResults, clearFilters, setFilterDropdown}) {
    
    return (
    <div className='absolute w-[650px] p-6 pt-0 mt-12 bg-white border border-gray-300 rounded-lg shadow-2xl'>
        
        <div className='absolute w-4 h-4 rotate-45 bg-white border border-gray-300 -top-1 '></div>
        <div className='absolute w-10 h-4 bg-white left-3'></div>
        
        <div className='flex justify-between'>
            <button 
                onClick={() => setFilterDropdown(false)}
                className='absolute w-8 h-8 text-gray-500 rounded-md hover:bg-gray-100 top-2 right-2'>
                    <MdClear size={18} className='mx-auto my-auto' />
            </button>
        </div>
        <Form
            form={filters}
            setForm={setFilters}
            button='ATM Ara'
            isFilter={true}
            handleSubmit={getFilteredResults}
        />
    </div>
    )
}

export default Filter