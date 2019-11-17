function getOne (sql, parameters, connection, callback) {
  if (arguments.length === 3) {
    callback = connection
    connection = parameters
    parameters = null
  }

  if (!parameters) {
    parameters = []
  }

  connection.get(sql, parameters, callback)
}

module.exports = getOne
