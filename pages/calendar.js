import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
// import localizer from 'react-big-calendar/lib/localizers/globalize'



const localizer = momentLocalizer(moment)

const events = [{
    id: 0,
    title: 'Single Day',
    allDay: true,
    start: new Date(2022, 0, 1),
    end: new Date(2022, 0, 1),
  },
  {
    id: 1,
    title: 'Long Event',
    start: new Date(2015, 3, 7),
  end: new Date(2015, 3, 10),
},

{
  id: 2,
    title: 'DTS STARTS',
  start: new Date(2016, 2, 13, 0, 0, 0),
  end: new Date(2016, 2, 20, 0, 0, 0),
}]


export default function CalendarPage() {

  return (
    <div>
      <Calendar
        events={events}

        step={60}
        showMultiDayTimes
        defaultDate={new Date(2015, 3, 1)}
        style={{ height: 500 }}
        localizer={localizer}
      />
    </div>
  )
}
