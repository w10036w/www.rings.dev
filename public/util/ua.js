function os(ua){
  if(/ipad|iphone|ipod/.test(ua)){
    return 'ios';
  }else if(/android/.test(ua)) {
    return 'android';
  }else if(/macintosh/.test(ua)) {
    return 'mac'
  }
  return 'desktop';//not mobile
}

function browser(ua) {
  if(/firefox\/\d/.test(ua)) return 'firefox'
  if(/chrome\/\d/.test(ua)) return 'chrome'
  if(/version\/\d/.test(ua) && os(ua)==='ios') return 'safari'
}
function webview(ua) {
  if(/fb/.test(ua)) return 'facebook'
  if(/twitter/.test(ua)) return 'twitter'
  if(/micromessenger/.test(ua)) return 'wechat'
  if(/qqbrowser/.test(ua)) return 'qq'
  return false
}
function bMobile(ua) {
  return /ipad|iphone|ipod|android|phone/.test(ua)
}
function bApp(ua, app = /rings/) {
  return app.test(ua)
}
if('undefined'!==typeof module)
module.exports = (ua)=>{
  return {
    ua: ua,
    os: os(ua),
    browser: browser(ua),
    bApp: bApp(ua),
    bMobile: bMobile(ua),
    webview: webview(ua),
  }
}