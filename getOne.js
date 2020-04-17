function getOne (connection, sql, parameters, callback) {
  if (arguments.length === 3) {
    callback = parameters;
    parameters = null;
  }

  if (!parameters) {
    parameters = [];
  }

  connection.get(sql, parameters, callback);
}

module.exports = getOne;
