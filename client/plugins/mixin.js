import { ifBtm } from 'util/dom'
import { throttle } from 'lodash'
// m- stands for variables / functions for mixins

const scrollBtmLoadMore = {
  data() {
    return {
      mScrollBtmWait: false
    }
  },
  methods: {
    mScrollBtm(self=this, el=window) {
      try {
        self.mScrollBtmWait = false
        function binding() {
          if(ifBtm(el) && !self.mScrollBtmWait && self.mScrollBtmTrigger()) {
            console.log(`scrollBtmLoadMore triggered: ${new Date()}`)
            self.mScrollBtmWait = true
            self.mScrollBtmCb().then(_=>{
              self.mScrollBtmWait = false })
          }
        }
        if(self.mScrollBtmHandler) {
          document.removeEventListener('scroll', self.mScrollBtmHandler)
        } else {
          self.mScrollBtmHandler = throttle(binding, 1000)
          document.addEventListener('scroll', self.mScrollBtmHandler)
        }
      } catch(e) {
        console.log(e)
      }
    }
  },
  mounted() {
    this.mScrollBtm(this)
  },
  deactivated(){
    this.mScrollBtm()
  },
}


module.exports = {
  scrollBtmLoadMore
}