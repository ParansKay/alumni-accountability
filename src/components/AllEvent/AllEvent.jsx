import React, { useState, useEffect } from 'react';
import {useSelector} from 'react-redux';
import './AllEvent.css';
import {useHistory} from 'react-router-dom';

// Basic functional component structure for React with default state
// value setup. When making a new component be sure to replace the
// component name AllEvent with the name for the new component.
function AllEvent(props) {
  // Using hooks we're creating local state for a "heading" variable with
  // a default value of 'Functional Component'
  const event = useSelector((store) => store.event);
  const history = useHistory();

  useEffect(() => {
    dispatch({ type: 'FETCH_ALL_EVENT'});
  }, []);


  return (
    <div>
      <h3>Here is a list of all events from all of time</h3>

      <main class="allEventContainer">
        {event.map(event => {
          let eventCompareDate = new Date(event.date);
          let twoDigitMonth = eventCompareDate.getMonth() + 1 + "";
          let twoDigitDate = eventCompareDate.getDate() + "";
          if (twoDigitDate.length == 1){
            twoDigitDate = "0" + twoDigitDate;
          }
          let eventDate = twoDigitMonth + "/" + twoDigitDate + "/" + eventCompareDate.getFullYear(); 

          const setOneEvent = () => {
            dispatch({
              type: 'SET_ONE_EVENT',
              payload: {
                id: event.id,
                title: event.title,
                date: event.date,
                time: event.time, 
                stack_type: event.stack_type,
                description: event.description
              }
            })

            history.push("/eventdetail");
          }
          return (
    
            <div className="allEventItem" onClick={setOneEvent}>
              <p class="allDateStyling" className="allEventDate">{eventDate}</p>
              <p class="allTimeStyling">{event.time.toLocaleString('en-US')}</p>
                
              {(event.stack_type === 'FSE') ?
                <p class="allStackTypeDisplay">FSE</p> :
                (event.stack_type === 'UX/UI') ?
                <p class="allStackTypeDisplay">UX/UI</p> :
                <span><p class="allStackTypeDualDisplay">FSE</p> <p class="allStackTypeDualDisplay">UX/UI</p></span>
              }

              {(event.title.length > 15) ?
                <h3 class="allCardStyling">{event.title.slice(0,15)}...</h3> :
                <h3 class="allCardStyling">{event.title}</h3>
              }
              
              {(event.description.length > 125) ?
                <p class="allCardStyling">{event.description.slice(0,125)}...</p> :
                <p class="allCardStyling">{event.description}</p>
              }
            </div>
          )
        })}
      </main>
    </div>
  );
}

export default AllEvent;
