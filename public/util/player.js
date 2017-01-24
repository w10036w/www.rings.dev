export function initClappr(e, dom='player') {
  let node = document.getElementById(dom)
  while(node.firstChild) {
    node.removeChild(node.firstChild)
  }
  window.player = new Clappr.Player({
    source: e.src,
    parentId: "#player",
    width: '100%',
    height: '100%',
    poster: e.poster,
  });
}
