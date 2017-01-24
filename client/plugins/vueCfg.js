const keyCodes = {
  f1: 112,
  play_pause: 179,
  up: [38, 87],
}
export default _=>{
  // bind keyCodes
  _.config.keyCodes = keyCodes
  // silent
  _.config.silent = true
}