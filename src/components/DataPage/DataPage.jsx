import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import {Bar, Chart, Pie} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';
import AttendanceChart from '../AttendanceChart/AttendanceChart';

// Basic functional component structure for React with default state
// value setup. When making a new component be sure to replace the
// component name DataPage with the name for the new component.
function DataPage(props) {
  // Using hooks we're creating local state for a "heading" variable with
  // a default value of 'Functional Component'
  const dispatch = useDispatch();
  const eventAttendance = useSelector((store) => store.eventAttendance);
  const event = useSelector((store) => store.event);
  const [eventID, setEventID] = useState(0);
  const [eventTitle, setEventTitle] = useState('');
  
  useEffect(() => {
    dispatch({ type: 'FETCH_EVENT'});
  }, []);

  let labels = [];
  for ( let i = 0; i < eventAttendance.length; i++) {
    labels.push(eventAttendance[i].cohort_name);
  }

  let data = [];
  for ( let i = 0; i < eventAttendance.length; i++) {
    data.push(eventAttendance[i].count);
  }
  
  const state = {
    labels: labels,
      
    datasets: [
      {
        label: 'Number of Attendees',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: data
      }
    ]
  }

  const displayChart = () => {
    dispatch({ type: 'FETCH_EVENT_ATTENDANCE', payload: eventID});
    
    for (let i=0; i<event.length; i++){
      if(event[i].id == eventID){
        setEventTitle(event[i].event_title);
        console.log(event[i].event_title);
      }
    }
  }

  return (
    <div>
    
    <div>
      <AttendanceChart eventID={eventID} eventTitle={eventTitle} redraw={true}/>
    </div>

    <select className="eventAttendanceDropdown" onChange={( event )=>setEventID(event.target.value)}>
      {event.map(event => 
        (<option key={event.id} value={event.id} className="eventOptions" >{event.event_title}</option>))}
    </select>
    <button id="submitChartBtn" onClick={displayChart}>Display Chart</button>
    </div>
    );
}

export default DataPage;
