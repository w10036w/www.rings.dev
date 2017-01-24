/**
 * API provider / proxy
 * path: { host }/api
 */
var r = require('express').Router();
//var mwAuth = require('../middleware/auth');
//const users = require('./users');
const recommend = require('./recommend');
const iTP = require('./iTP');
const bdcSession = require('./bdcSession');
const bdcMsg = require('./bdcMsg');
const bdcInfo = require('./bdcInfo');
const bdcUpcoming = require('./bdcUpcoming');
const bdcReplay = require('./bdcReplay');
const oprAdvertise = require('./oprAdvertise');

/*r.get('/test', users.query);
r.get('/users', users.query);
r.post('/users', users.create);
r.get('/users/:name', users.queryByName);
r.put('/users', users.update);
//r.put('/users', mwAuth.adminAndSelfAgent, users.update);
r.delete('/users', mwAuth.adminAgent, users.clear);*/
/** bdcSession */

r.post('/session/like/:sid', bdcSession.like)

r.get('/session/stat/:cid/:sid', bdcSession.stat)

/** bdcMsg */

r.get('/msg/live/:cid', bdcMsg.live)

r.get('/msg/replay/:sid', bdcMsg.replay)

/** bdcInfo */

r.post('/info/follow/:uid/:hid', bdcInfo.follow)
r.post('/info/unfollow/:uid/:hid', bdcInfo.unfollow)

r.get('/info/followings/:tid', bdcInfo.followings)
r.get('/info/followers/:hid', bdcInfo.followers)
r.get('/info/host_info/:uid', bdcInfo.host_info)

r.post('/info/update_pv/:cid', bdcInfo.update_pv) //body.count
r.post('/info/follow_all/:uid', bdcInfo.follow_all) //body.hids=[]
r.post('/info/unfollow_all/:uid', bdcInfo.unfollow_all)//body.hids=[]

r.get('/info/top_fans/:cid/:sid', bdcInfo.top_fans)

r.post('/info/promote/', bdcInfo.add_itp)
r.get('/info/live_stat/:cid', bdcInfo.live_stat)
r.get('/info/replay_ad/:mid', bdcInfo.replay_ad)

/** bdcUpcoming */
r.get('/upcoming/id/:eid', bdcUpcoming.read);

/** bdcReplay */
r.get('/replay/event_replays/:eid', bdcReplay.event_replays);


/** recommend */
r.get('/recommend/live_list', recommend.live_list)
r.get('/recommend/upcoming_list', recommend.upcoming_list)
r.get('/recommend/replay_list', recommend.replay_list)
r.get('/recommend/live_replay_list', recommend.live_replay_list) //no page
r.get('/recommend/event_list/:user_id', recommend.event_list)
r.get('/recommend/channel_list/:category_id', recommend.channel_list)
r.get('/recommend/following_events/:user_id', recommend.following_events)
r.post('/recommend/promote_replay/:media_id', recommend.promote_replay)
r.post('/recommend/unpromote_replay/:media_id', recommend.unpromote_replay)
r.get('/recommend/replays/top', recommend.top_replays)

r.get('/recommend/search_events_channels', recommend.search_events_channels)

r.get('/recommend/video/:cid(\\d+)/:sid(\\w+)', recommend.event_info)
r.get('/recommend/replays', recommend.replays)
r.get('/recommend/live_replay', recommend.live_replay)

r.get('/recommend/upcomings/:eid', recommend.upcomings)
r.get('/recommend/replays_category/:id(\\d+)?', recommend.replays_category) // no page
//(\\d+)? to constraint :id, can be null

/** operation advertisement / banner */
r.get('/banner', oprAdvertise.get_all)

/** iTP */
r.post('/itps', iTP.create);
r.get('/itps', iTP.index);
r.put('/itps/:id', iTP.update);
r.delete('/itps/:id', iTP.remove);
r.post('/itps/:id/live/:cid', iTP.online);
r.post('/itps/:id/replay/:mid', iTP.replay);

module.exports = r;