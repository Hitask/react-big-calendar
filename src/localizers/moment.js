import dates from '../utils/dates'
import { DateLocalizer } from '../localizer'

let dateRangeFormat = ({ start, end }, culture, local) =>
  local.format(start, 'L', culture) + ' — ' + local.format(end, 'L', culture)

let timeRangeFormat = ({ start, end }, culture, local) =>
  local.format(start, 'LT', culture) + ' — ' + local.format(end, 'LT', culture)

let timeRangeStartFormat = ({ start, end }, culture, local) =>
  local.format(start, 'LT', culture) + ' — '

let timeRangeEndFormat = ({ start, end }, culture, local) =>
  ' — ' + local.format(end, 'LT', culture)

let weekRangeFormat = ({ start, end }, culture, local) =>
  local.format(start, 'MMMM D', culture) +
  ' - ' +
  local.format(end, dates.eq(start, end, 'month') ? 'D' : 'MMMM D', culture)

export let formats = {
  dateFormat: 'D',
  dayFormat: 'D ddd',
  weekdayFormat: 'ddd',

  selectRangeFormat: timeRangeFormat,
  eventTimeRangeFormat: timeRangeFormat,
  eventTimeRangeStartFormat: timeRangeStartFormat,
  eventTimeRangeEndFormat: timeRangeEndFormat,

  timeGutterFormat: 'LT',

  monthHeaderFormat: 'MMMM YYYY',
  dayHeaderFormat: 'dddd MMM D',
  dayRangeHeaderFormat: weekRangeFormat,
  agendaHeaderFormat: dateRangeFormat,

  agendaDateFormat: 'ddd MMM D',
  agendaTimeFormat: 'LT',
  agendaTimeRangeFormat: timeRangeFormat,
}

export default function(moment) {
  let locale = (m, c) => (c ? m.locale(c) : m)

  return new DateLocalizer({
    formats,
    firstOfWeek(culture) {
      let data = culture ? moment.localeData(culture) : moment.localeData()
      return data ? data.firstDayOfWeek() : 0
    },

    format(value, format, culture) {
      return locale(moment(value), culture).format(format)
    },
  })
}
