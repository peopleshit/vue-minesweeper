import _ from 'lodash'

const addLeadingZero = (value) => value < 10 ? `0${value}` : value
const formatSeconds = (value) => {
  const hours = _.floor(value / 3600)
  const minutes = _.floor(value / 60) - (hours * 60)
  const seconds = value - hours * 3600 - minutes * 60

  return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`
}

export {
  formatSeconds
}