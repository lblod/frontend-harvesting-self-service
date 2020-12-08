import { helper } from '@ember/component/helper';

export default helper(function formatDatetime([param]) {
  let dateObj = new Date(param)

  let day = dateObj.getDay()
  let month = dateObj.getMonth()
  let year = dateObj.getFullYear()

  let hour = dateObj.getHours()
  let minutes = dateObj.getMinutes()
  let seconds = dateObj.getSeconds()

  return `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`

});
