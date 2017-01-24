startCd(parseInt(configOptions.ts) * 1000);
function startCd(ts) {
  if(!ts) return
  var offset = new Date().getTimezoneOffset() / 60;
  ts += offset * 60 * 60 * 1000;
  var $cd = $('.countdown');
  if (ts <= Date.now()) {
    $cd.hide();
    return;
  }
  var str;
  var timer = $('.timer');
  str       = ts2cd(ts);
  timer.html(str);
  if (str === '') {
    $cd.addClass('text-center').text('Live streaming is about to start');
    return;
  }
  var eventCd = setInterval(function () {
    str = ts2cd(ts);
    if (str === '') {
      $cd.addClass('text-center').text('Live streaming is about to start');
      clearInterval(eventCd);
      return;
    }
    if (timer.html() !== str) {
      timer.html(str);
    }
  }, 1000);
}
function ts2cd(ts) {
  var diffMS   = ts - new Date();
  var diffSecs = Math.floor(diffMS / 1000);
  var diffMins = Math.floor(diffSecs / 60);
  //var s = diffSecs % 60;
  var h        = Math.floor(diffMins / 60);
  var d        = Math.floor(h / 24);
  h            = h % 24;
  var m        = Math.floor(diffMins % 60);
  var str      = (d > 0 ? d : '') + (d > 0 ? d === 1 ? ' DAY ' : ' DAYS ' : '');
  str += (h > 0 ? h : '') + (h > 0 ? h === 1 ? ' HOUR ' : ' HOURS ' : '');
  str += (m > 0 ? m : '') + (m > 0 ? m === 1 ? ' MIN' : ' MINS' : '');
  return str;
}
