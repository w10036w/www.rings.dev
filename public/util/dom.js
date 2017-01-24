/**
 * @param el
 * @param dist
 * @returns {boolean}
 */
const ifBtm = (el=window, dist=0) => {
  return el.innerHeight + el.scrollY >= document.body.scrollHeight - dist
}

/**
 * @param x
 * @param y
 * @param dom
 */
const smoothScroll = (x, y, dom=window) => {
  let isRoot = dom===window
  let cY = isRoot ? window.scrollY : dom.scrollTop
  let cX = isRoot ? window.scrollX : dom.scrollLeft
  let sh = dom.scrollHeight
  const dY = (cY-y)/30  //complete in .5s
  const dX = (cX-x)/30
  setTimeout(function(){
    requestAnimationFrame(fnScroll)
  }, 0)

  function fnScroll(){
    if(Math.abs(cY-y)>0.1 || Math.abs(cX-x)>0.1){
      cY-=dY
      cX-=dX
      if(isRoot) {
        dom.scrollTo(cX, cY)
      } else {
        dom.scrollTop = cY
        dom.scrollLeft = cX
      }
      requestAnimationFrame(fnScroll)
    }
  }
}

function throttle(fn, ts=300, scope) {
  let last, deferTimer
  return function(...args) {
    const self = scope || this
    const now = +new Date
    if (last && now < last+ts) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(_=>{
        last = now
        fn.apply(self, args)
      }, ts)
    } else {
      last = now
      fn.apply(self, args)
    }
  }
}

/**
 *
 * @param self, scrollBtmTrigger, scrollBtmCb
 * @param el
 */
const scrollBtm = (self, el=window) => {
  try {
    self.scrollBtmWait = false
    function binding() {
      if(ifBtm(el) && !self.scrollBtmWait && self.scrollBtmTrigger()) {
        self.scrollBtmWait = true
        self.scrollBtmCb().then(_=>{
          self.scrollBtmWait = false })
      }
    }
    if(self.scrollBtmHandler) {
      document.removeEventListener('scroll', self.scrollBtmHandler)
    } else {
      // can use lodash throttle instead
      self.scrollBtmHandler = throttle(binding)
      document.addEventListener('scroll', self.scrollBtmHandler)
    }
  } catch(e) {
    console.log(e)
  }

}

module.exports = {
  ifBtm, smoothScroll, scrollBtm
}