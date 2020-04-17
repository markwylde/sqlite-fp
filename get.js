function getAll (connection, sql, parameters, callback) {
  if (arguments.length === 3) {
    callback = connection;
    connection = parameters;
    parameters = null;
  }

  if (!parameters) {
    parameters = [];
  }

  connection.all(sql, parameters, callback);
}

module.exports = getAll;
