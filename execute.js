function execute (connection, sql, callback) {
  connection.exec(sql, callback);
}

module.exports = execute;
