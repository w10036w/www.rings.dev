function vstr(str) {
  var args = [].slice.call(arguments, 1),
      i = 0;
  return str.replace(/%s/g, function() {
    return args[i++];
  });
}
function fmtDesc(str) {
  return str.replace(/\r\n/g, str)
}

exports.vstr = vstr
exports.fmtDesc = fmtDesc
