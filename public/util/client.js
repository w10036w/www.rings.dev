var vstr = require('./strExt').vstr
//in-app func
var inAppProto = 'ringsmozat';
var invokeAppProto = 'mozatrings';
var sendReq = (uri)=>{
  console.log(uri);
  var iframe = document.querySelector('#iframe-app-bridge');
  iframe.insertAdjacentHTML('afterbegin', '<iframe src="'+uri+'"></iframe>');
};
var inApp = {
  pageProfile(uid, cid) {
    var uri;
    // TODO: [iOS] hack
    if (ua.os()==='ios') {
      uri = vstr('%s://broadcast/openVideo?cid=%s',
        inAppProto, cid);
    } else {
      uri = vstr('%s://general/openChannelprofile?uid=%s&cid=%s',
        inAppProto, uid, cid);
    }
    sendReq(uri)
  },
  openVideo(cid, sid) {
    var uri = vstr("%s://broadcast/openVideo?cid=%s&sid=%s",
      inAppProto, cid, sid);
    sendReq(uri);
  },
  regEvent(eventId) {
    var __id = eventId || eid;
    di.regEvent(__id);
    var url = vstr('%s://broadcast/registerEvent?callback=%s&eventId=%s',
      inAppProto, 'inApp.regEventCb', __id);
    sendReq(url);
  },
  regEventCb() {
    var $spanRegisterCount = $("span.register-count");
    var count              = parseInt($spanRegisterCount.html());
    count++;
    $spanRegisterCount.html(count);
    showShortTip('event registered successfully');
    $(".btn-remind-control").addClass('btn-followed');
  },
  unregEvent(eventId) {
    var __id = eventId || eid;
    var url = vstr('%s://broadcast/unregisterEvent?callback=%s&eventId=%s',
      inAppProto, 'inApp.unregEventCb', __id);
    sendReq(url);
  },
  unregEventCb() {
    var $spanRegisterCount = $("span.register-count");
    var count              = parseInt($spanRegisterCount.html());
    count--;
    $spanRegisterCount.html(count);
    showShortTip('event unregistered successfully');
    $(".btn-remind-control").removeClass('btn-followed');
  },
  foUser(userId, cid) {
    // TODO: [iOS] for unfixed issue that time, they should have fixed it
    var uri;
    uri = vstr('%s://account/follow?uid=%s&callback=%s',
      inAppProto, userId, 'followUserCallback');
    !debug && di.foUser(cid);
    sendReq(uri);
  },
  unfoUser(userId) {
    // TODO: [iOS] for unfixed issue that time, they should have fixed it
    var uri;
    uri = vstr('%s://account/unFollow?uid=%s&callback=%s',
      inAppProto, userId, 'unfollowUserCallback');
    sendReq(uri);
  },
  purchaseEvent(id) {
    id      = id.toString();
    var purchaseUrl = configOptions.purchaseUrl;
    var url = vstr('ringsmozat://broadcast/purchaseEvent?callback=%s&eventId=%s&purchaseUrl=%s',
      null, id, encodeURIComponent(purchaseUrl));
    sendReq(url);
  },
  // send link and content to app when page ready
  pageEventInit() {
    if(!isRings && !debug) { return; }
    var content = configOptions.content;
    if(content){
      content = content.length >= 20 ? content.substr(0, 21)+'...' : content;
      content = encodeURIComponent(content);
    }else{
      content = ''
    }
    var path = location.protocol + '//' + location.host + location.pathname;
    var link = encodeURIComponent(path);
    var uri = vstr('%s://broadcast/prepareShare?content=%s&link=%s',
      inAppProto, content, link)
    sendReq(uri);
  }
};
// invoke-app func
var invokeApp = {
  event(eventId) {
    var uri = String.Format('mozatrings://openEventPage/{0}',
      eventId || eid);
    sendReq(uri);
  },
  video(cid, sid) {
    var uri = vstr('%s://video/%s/%s',
      invokeAppProto,  cid, sid);
    sendReq(uri);
  },
  // TODO: [new] open profile / webview in the future

  home(iosUniversal) {
    if(iosUniversal) {
      location.href = vstr('%s://', invokeAppProto)
    }
    sendReq(vstr('%s://', invokeAppProto));
  }
}

var appInfo = {
  download:{
    appStore: 'https://itunes.apple.com/app/rings.tv-interactive-broadcasting/id1011210996?mt=8',
    playStore: 'https://play.google.com/store/apps/details?id=mozat.rings',
    yingyongbao: 'http://a.app.qq.com/o/simple.jsp?pkgname=mozat.rings',
  },
}

function downloadApp(ua) {
  let link
  if(ua.os==='ios')
    link = appInfo.download.appStore
  else if(ua.webview==='wechat')
    link = appInfo.download.yingyongbao
  else if(ua.os==='android')
    link = appInfo.download.playStore
  console.log(link)
  location.href = link
}

if("object"==typeof exports&&"undefined"!=typeof module)
module.exports = {
  invokeApp, inApp, appInfo, downloadApp
}