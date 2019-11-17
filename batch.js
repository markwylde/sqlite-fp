const righto = require('righto')  

function insertRow (sql, listOfParameters, connection, callback) {
  const statement = connection.prepare(sql)

  listOfParameters.forEach(parameters => {
    statement.run(parameters)
  })

  statement.finalize(callback)
}

function batch (sql, listOfParameters, connection, callback) {
  if (arguments.length === 3) {
    callback = connection
    connection = listOfParameters
    listOfParameters = null
  }

  if (!listOfParameters) {
    listOfParameters = []
  }

  const transaction = righto(connection.run.bind(connection), 'BEGIN TRANSACTION')
  const insertedRows = righto(insertRow, sql, listOfParameters, connection, righto.after(transaction))
  const commited = righto(connection.run.bind(connection), 'COMMIT', righto.after(insertedRows))

  commited(callback)
}

module.exports = batch
