
import React, { useState,useEffect } from 'react';
import {Typography,Checkbox,TextField} from '@mui/material'
import { Link } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux'
import AlumSkills from '../AlumSkills/AlumSkills'
import AlumNotes from '../AlumNotes/AlumNotes'
//IMPORT SCSS 
import '../AlumDetail/AlumDetail.scss'

// Basic functional component structure for React with default state
// value setup. When making a new component be sure to replace the
// component name AlumDetail with the name for the new component.
function AlumDetail(props) {
  // Using hooks we're creating local state for a "heading" variable with
  // a default value of 'Functional Component'
  const dispatch = useDispatch()
  const oneAlum = useSelector((store) => store.oneAlum);

  useEffect(() => {
    dispatch({type : "FETCH_ALUMNOTE", payload : oneAlum.id})
  }, [dispatch])

  const handleCheckbox = (id,placedStatus)=>{
    const data = {id,placedStatus : !placedStatus}
    dispatch({type : "ALUM_PLACED", payload : data})
    
  }

  const placedDateHandler = (e,id)=> {
    // setplacedDate(e.target.value)
    console.log(typeof(e.target.value))
    const data = {id,placedDate : e.target.value}
    dispatch({type : "ALUM_PLACED_DATE", payload : data})
  }

  return (
    <main className="alumDetailMainDiv">
         <div className='alumDetailCol1'>
           <div className="alumDetailTitleandStack">
                <div className="alumDetailTitleDiv">   
                  <h2 id="alumDetailTitle">{oneAlum.name || oneAlum.alum_name}</h2>
                </div>
                <div className="eventDetailStackType">
                  <p>FSE</p>
                </div>
            </div>
            <div className="tobePlacedOrNotToBePlaced">
                <p>{oneAlum.alum_placed ? "Placed" : "Seeking"}</p>
                <p>Events Attended = {oneAlum.event_count}</p>
                <Typography variant="subtitle">Placed</Typography>
                <Checkbox  checked={oneAlum.alum_placed} onChange={()=>handleCheckbox(oneAlum.id,oneAlum.alum_placed)} />
                {oneAlum.alum_placed && 
                <div>
                    <input type="date" className="createnewDateInput" autoComplete= "off" 
                    required  onChange={(e)=>placedDateHandler(e,oneAlum.id)} />  
                </div>
                }
                {oneAlum.alum_placed && oneAlum.placed_date &&
                <div>
                  <Typography variant="subtitle">Placed on : {oneAlum.placed_date.split("T")[0]}</Typography>
                </div>
                }
            </div>
        </div>
      <div style={{marginTop:"1rem"}}>
        < AlumSkills />
      </div>
      <div>      
        < AlumNotes />
      </div>
  </main>
  );
}

export default AlumDetail;