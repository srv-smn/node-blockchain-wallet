const sendResponse = async (res, statusCode, message, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify({
      'status': statusCode,
      'message': message,
      'data': data
    }))
    res.end()
  }

  const sendError = async (res, statusCode, errorMessage, error) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify({
      'status': statusCode,
      'errorMessage': errorMessage,
      'error': error
    }))
    res.end()
  }

module.exports = {
    sendResponse,
    sendError
}