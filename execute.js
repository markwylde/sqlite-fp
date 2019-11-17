function execute (sql, connection, callback) {
  connection.exec(sql, callback)
}

module.exports = execute
