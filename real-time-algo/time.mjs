'use strict'

export const MINS_MILLIS = 60000
export const HOURS_MILLIS = 60 * MINS_MILLIS
export const DAYS_MILLIS = 24 * HOURS_MILLIS

export function addMonthsToDate (date, months) {
  const now = new Date(date)
  return new Date(now.setMonth(now.getMonth() + months))
}

export function dateToMonthstamp (date) {
  // we could use Intl.DateTimeFormat but that doesn't support .format() on Android
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/format
  return new Date(date).toISOString().slice(0, 7)
}

// TODO: to prevent conflicts among user timezones, we need
//       to use the server's time, and not our time here.
//       https://github.com/okTurtles/group-income/issues/531
export function currentMonthstamp () {
  return dateToMonthstamp(new Date())
}

export function ISOStringToMonthstamp (date) {
  return dateToMonthstamp(new Date(date))
}

export function dateFromMonthstamp (monthstamp) {
  // this is a hack to prevent new Date('2020-01').getFullYear() => 2019
  return new Date(`${monthstamp}-01T00:01`)
}

export function prevMonthstamp (monthstamp) {
  const date = dateFromMonthstamp(monthstamp)
  date.setMonth(date.getMonth() - 1)
  return dateToMonthstamp(date)
}

export function compareMonthstamps (monthstampA, monthstampB) {
  const dateA = dateFromMonthstamp(monthstampA)
  const dateB = dateFromMonthstamp(monthstampB)
  const A = dateA.getMonth() + dateA.getFullYear() * 12
  const B = dateB.getMonth() + dateB.getFullYear() * 12
  return A - B
}

export function compareCycles (whenEnd, whenStart) {
  return compareMonthstamps(dateToMonthstamp(whenEnd), dateToMonthstamp(whenStart))
}

export function compareISOTimestamps (a, b) {
  const A = new Date(a).getTime()
  const B = new Date(b).getTime()
  return A - B
}

export function getTime (date) {
  const t = new Date(date)
  return `${t.getHours()}:${t.getMinutes()}`
}

export function lastDayOfMonth (date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function firstDayOfMonth (date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// TODO: Provide locale fallback in case navigator does not exist (e.g. server, Mocha, etc...)
const locale = (typeof navigator === 'undefined' && 'en-US') || (navigator.languages ? navigator.languages[0] : navigator.language)

export function humanDate (
  datems,
  opts = { month: 'short', day: 'numeric' }
) {
  if (!datems) {
    console.error('humanDate:: 1st arg `datems` is required')
    return ''
  }
  return new Date(datems).toLocaleDateString(locale, opts)
}

export function proximityDate (date) {
  date = new Date(date)
  const today = new Date()
  const yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
  const lastWeek = (d => new Date(d.setDate(d.getDate() - 7)))(new Date())

  for (const toReset of [date, today, yesterday, lastWeek]) {
    toReset.setHours(0)
    toReset.setMinutes(0)
    toReset.setSeconds(0, 0)
  }

  const datems = Number(date)
  let pd = date > lastWeek ? humanDate(datems, { month: 'short', day: 'numeric', year: 'numeric' }) : humanDate(datems)
  if (date.getTime() === yesterday.getTime()) pd ='Yesterday'
  if (date.getTime() === today.getTime()) pd ='Today'

  return pd
}

export function timeSince (datems, dateNow = Date.now()) {
  const interval = dateNow - datems

  if (interval >= DAYS_MILLIS * 2) {
    return humanDate(datems)
  }
  if (interval >= DAYS_MILLIS) {
    return '1d'
  }
  if (interval >= HOURS_MILLIS) {
    return Math.floor(interval / HOURS_MILLIS) + 'h'
  }
  return Math.max(1, Math.floor(interval / MINS_MILLIS)) + 'm'
}

export function cycleAtDate (atDate) {
  const now = new Date(atDate) // Just in case the parameter is a string type.
  const partialCycles = now.getDate() / lastDayOfMonth(now).getDate()
  return partialCycles
}
