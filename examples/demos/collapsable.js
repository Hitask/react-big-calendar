import React from 'react'
import BigCalendar from 'react-big-calendar'
import events from '../events'

let Collapsable = () => (
  <React.Fragment>
    <h3 className="callout">
      Click the "+x more" link on any calendar day that cannot fit all the days
      events to see collapsable view of all the events.
    </h3>
    <BigCalendar
      collapsable
      events={events}
      defaultDate={new Date(2015, 3, 1)}
    />
  </React.Fragment>
)

export default Collapsable
