module.exports = function(req) {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
};
