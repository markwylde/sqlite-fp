function run (connection, sql, parameters, callback) {
  if (arguments.length === 3) {
    callback = parameters;
    parameters = null;
  }

  if (!parameters) {
    parameters = [];
  }

  const statement = connection.prepare(sql, function (error) {
    if (error) {
      return callback(error);
    }

    statement.run(parameters, function (error) {
      if (error) {
        return callback(error);
      }

      callback(null, {
        lastID: this.lastID,
        changes: this.changes
      });
    });
    statement.finalize();
  });
}

module.exports = run;
