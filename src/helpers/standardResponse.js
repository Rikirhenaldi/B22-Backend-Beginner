exports.response = (res, status = 200, success = true, message = 'this is message', results, pageInfo) => {
  return res.status(status).json({
    status,
    success,
    message,
    results,
    pageInfo
  })
}
