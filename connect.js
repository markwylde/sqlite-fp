const sqlite3 = require('sqlite3');

function connect (file, mode, callback) {
  if (arguments.length === 2) {
    callback = mode;
    mode = null;
  }

  if (!mode) {
    mode = ['OPEN_READWRITE', 'OPEN_CREATE'];
  }

  const db = new sqlite3.Database(file, mode);

  callback(null, db);
}

module.exports = connect;
