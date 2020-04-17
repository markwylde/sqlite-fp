const righto = require('righto');

function insertRow (connection, sql, listOfParameters, callback) {
  const statement = connection.prepare(sql);

  listOfParameters.forEach(parameters => {
    statement.run(parameters);
  });

  statement.finalize(callback);
}

function batch (connection, sql, listOfParameters, callback) {
  if (arguments.length === 3) {
    callback = connection;
    connection = listOfParameters;
    listOfParameters = null;
  }

  if (!listOfParameters) {
    listOfParameters = [];
  }

  const transaction = righto(connection.run.bind(connection), 'BEGIN TRANSACTION');
  const insertedRows = righto(insertRow, connection, sql, listOfParameters, righto.after(transaction));
  const commited = righto(connection.run.bind(connection), 'COMMIT', righto.after(insertedRows));

  commited(callback);
}

module.exports = batch;
