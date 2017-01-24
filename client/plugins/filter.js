/* @flow weak */
import { vstr } from 'util/strExt'

// string
const host = (url:string) => {
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const parts = host.split('.').slice(-3)
  if (parts[0] === 'www') parts.shift()
  return parts.join('.')
}
const add_link = str => {
  var uri = /(https?^\s+)|(?:goo.gl\/\w+)/
  var match = uri.exec(str)
  while(match) {
    var hasHttp = /https?/.exec(match[0])
    if(hasHttp) {
      str = str.replace(uri, `<a href="${match[0]}" target="_blank" title="${match[0]}">${match[0]}</a>`)
    }else{
      str = str.replace(uri, `<a href="http://${match[0]}" target="_blank" title="${match[0]}">${match[0]}</a>`)
    }
    match = uri.exec(str)
  }
  return str
}

// timestamp
function pluralize (time, label) {
  if (time === 1) {
    return time + label + ' ago'
  }
  return time + label + 's ago'
}
function offset(ts) {
  const _offset = new Date().getTimezoneOffset()
  return ts + _offset * 3600000
}

const timeAgo = (time:number) => {
  const between = (Date.now() - time)/1000;
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}
const ts2cd = (ts:number) => {
  var diffMS = ts - Date.now();
  if(diffMS<=0) return ''
  var diffSecs = Math.floor(diffMS / 1000);
  var diffMins = Math.floor(diffSecs / 60);
  var h = parseInt(diffMins / 60);
  var d = Math.floor(h/24);
  h = h%24;
  var m = parseInt(diffMins % 60);
  var str =  (d>0?d:'')+(d>0?d===1?' DAY ':' DAYS ':'');
  str+= (h>0?h:'')+(h>0?h===1?' HOUR ':' HOURS ':'');
  str+= (m>0?m:'')+(m>0?m===1?' MIN':' MINS':'');
  return str;
}
const recent = num => {
  var date = new Date(num),
      today = new Date();
  var todayDay = today.getUTCDate(),
      todayMon = today.getUTCMonth()+ 1;
  var str = date.toString(),
      timeStr = str.substring(15, 21),
      dayStr = date.getDate(),
      monStr = date.getMonth()+1;
  if(todayMon === monStr){
    if(todayDay === dayStr) return 'Today '+timeStr
    else if(todayDay === dayStr-1) return 'Tomorrow '+timeStr
  }
  if(dayStr<10){dayStr='0'+dayStr;}
  if(monStr<10){monStr='0'+monStr;}
  return monStr+'-'+dayStr+' '+timeStr;
}

const ts2hiDdmy = ts => {
  const s = new Date(ts).toString();
  // ip: Sun Jan 01 2017 17:20:24 GMT+0800 (SGT)
  // op: 10:30 Sun, 01 Jan, 2017
  return vstr('%s %s, %s %s, %s',
    s.substr(16, 5), s.substr(0, 3), s.substr(8, 3),
    s.substr(4, 4), s.substr(11, 4));
}

export {
  host, add_link, // str
  timeAgo, recent, ts2hiDdmy, ts2cd, // ts
}