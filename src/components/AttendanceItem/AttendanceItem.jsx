import React, { useState } from 'react';
import {useSelector} from 'react-redux';
import './AttendanceItem.css';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';

// Basic functional component structure for React with default state
// value setup. When making a new component be sure to replace the
// component name AllEvent with the name for the new component.
function Attendance(props) {
  // Using hooks we're creating local state for a "heading" variable with
  // a default value of 'Functional Component'
  const dispatch = useDispatch();
  const history = useHistory();

  let eventCompareDate = new Date(props.alum.graduation_date);
  let twoDigitMonth = eventCompareDate.getMonth() + 1 + "";
  let twoDigitDate = eventCompareDate.getDate() + "";
  if (twoDigitDate.length == 1){
    twoDigitDate = "0" + twoDigitDate;
  }
  let alumGraduationDate = twoDigitMonth + "/" + twoDigitDate + "/" + eventCompareDate.getFullYear(); 

  const setOneAlum = () => {
    dispatch({
      type: 'SET_ONE_ALUM',
      payload: {
        id: props.alum.id,
        name: props.alum.name,
        cohort: props.alum.cohort_name,
        graduation_date: props.alum.graduation_date
      }
    })

    history.push("/alumdetail");
  }

  if (props.alum.placed === false){
    return (
        <tr >
          <td className='alumAttended'><input type='checkbox' id='alumAttendance' value='attended' onChange={(event) => props.handleCheckboxChange(props.alum.id)}/></td>
          <td class='alumName' onClick={setOneAlum}>{props.alum.alum_name}</td>
          <td class='alumCohort' onClick={setOneAlum}>{props.alum.name}</td>
          <td class='alumGradDate' onClick={setOneAlum}>{alumGraduationDate}</td>
        </tr>
    );
  } else {
    return null;
  }
}

export default Attendance;
