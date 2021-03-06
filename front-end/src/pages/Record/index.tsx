import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import { RecordResponse } from '../../core/types/Records';
import { makeRequest } from '../../core/utils/request';
import Pagination from '@material-ui/lab/Pagination';
import './styles.scss'
import RecordFilters from '../../core/components/RecordFilters';



const Record = () =>{
        
    const [recordResponse, setRecordResponse] = useState<RecordResponse>();
    const [activePage,setActivePage] = useState(0);
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    
    moment.locale('pt-br')
    
    const getRecords = useCallback(() => {
        const params = {
            page: activePage,
            linesPerPage:12,
            min: minDate,
            max: maxDate
        }
       
            makeRequest({url: '/records', params})
            .then(response => {
                setRecordResponse(response.data)
             })
    },[activePage,minDate,maxDate])


    
    useEffect(() => {
       getRecords();

       
    },[getRecords])

    const handleChangeMinDate = (min: string) => {
        setActivePage(0)
        if(min.length ===10 || min.length === 0){
            setMinDate(min);
        }
        
    }
    const handleChangeMaxDate = (max: string) => {
        setActivePage(0)
        if(max.length === 10){
            setMaxDate(max)
        }

        
    }

    const clearFilters = () => {
        setActivePage(0)
        setMinDate('')
        setMaxDate('');
    }
    

    return (
        <div className="record-container">
            <div className="record-content">
                <RecordFilters
                minDate={minDate}
                maxDate={maxDate} 
                clearFilters={clearFilters}
                handleChangeMaxDate={handleChangeMaxDate}
                handleChangeMinDate={handleChangeMinDate}/>
                <table className="table-record" cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>Instante</th>
                            <th>Nome</th>
                            <th>Idade</th>
                            <th>Plataforma</th>
                            <th>Gênero</th>
                            <th>Título do game</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                            {recordResponse?.content.map(record =>(
                                <>
                                <tr>
                                    <td>{moment(record.moment).format('L')}</td>
                                    <td>{record.name}</td>
                                    <td>{record.age}</td>
                                    <td>{record.gamePlatform}</td>
                                    <td>{record.genreName}</td>
                                    <td>{record.gameTitle}</td>
                                    <td hidden>key={record.id}</td>
                                </tr>    
                                </>
                            ))}
                            
                       
                    </tbody>
                </table>

                {recordResponse && (
                    
                    <>
                        <div className="pagination-record">
                            <Pagination  color="primary" count={recordResponse.totalPages} page={activePage + 1} 
                            onChange={(event,page)=>{ setActivePage(page-1)}}
                             />
                        </div>


                    </>

                )}               
        
            </div>
        </div>
    );
}

export default Record;