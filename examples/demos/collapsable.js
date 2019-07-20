import React from 'react'
import BigCalendar from 'react-big-calendar'
import events from '../events'

let Collapsable = ({ localizer }) => (
  <BigCalendar
    collapsable
    events={events}
    defaultDate={new Date(2015, 3, 1)}
    localizer={localizer}
  />
)

export default Collapsable
