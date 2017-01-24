const em = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i
exports.email = em
exports.number = '-?[0-9]*(\\.[0-9]+)?'
exports.natural = '[0-9]*'
exports.int = '-?[0-9]*]'
exports.positive = '[0-9]*(\\.[0-9]+)?'
exports.email = '[\w\.]+@[\w\.+]'