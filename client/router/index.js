import Vue from 'vue'
import Router from 'vue-router'

import AllUserView from '../views/AllUserView.vue'
import HomeView from '../views/HomeView.vue'
import VideoView from '../views/VideoView.vue'
import ProfileView from '../views/ProfileView.vue'
import UpcomingView from '../views/UpcomingView.vue'
import SearchView from '../views/SearchView.vue'
import ReplaysView from '../views/ReplaysView.vue'
import Page404 from '../views/Page404.vue'

Vue.use(Router)

const r = new Router({
  mode: 'history',
  scrollBehavior: (to, from, savedPosition)=>{
    if(savedPosition && to.path!=='/replays/'){
      return savedPosition
    } else {
      setTimeout(function(){
        return { x:0, y:1 }
      }, 100)
    }
  },
  routes: [
    { path:'/', component:HomeView },
    { path:'/#*', component:HomeView },
    { path:'/s/:cid/:sid', component:VideoView },
    { path:'/share/event/:eid', component:UpcomingView },
    { path:'/u/:uid', component:ProfileView },
    { path:'/replays/*', component:ReplaysView },
    { path:'/search', component:SearchView },
    //{ path:'/vote/:vid', component:VoteView },
    // for operations (future)
    //{ path:'/operation/*', component:OperationView },

    /** async route, for heavy views */
    /*{
      path:'/search',
      component:resolve=>{
        require.ensure(['../views/SearchView.vue'], ()=>{
          resolve(require('../views/SearchView.vue'))
        })
      }
    },*/
    
    /** 404 redirection */
    { path:'*', component:Page404 },
    //{ path:'*', redirect:'/' },
  ],
})

export default r