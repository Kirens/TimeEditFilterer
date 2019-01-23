module.exports = url =>
  url.slice(0,4) === '/v1/'
  ? decodeURIComponent(url.slice(4))
  : undefined
