const fs = require('fs');

const righto = require('righto');
const chance = require('chance')();

const connect = require('../connect');
const batch = require('../batch');
const execute = require('../execute');

const wipeFile = righto(fs.unlink, 'test.sqldb');
const handleNoFile = righto.handle(wipeFile, function (_, callback) {
  callback(null, true);
});
const connection = righto(connect, 'test.sqldb', righto.after(handleNoFile));
const tableCreated = righto(execute, 'CREATE TABLE test (id TEXT, firstName TEXT, lastName TEXT, email TEXT)', connection);

tableCreated(function (error, result) {
  if (error) {
    return console.log(error);
  }

  function insertBatch () {
    const entries = [];

    for (let i = 0; i < 100; i++) {
      entries.push([chance.guid(), chance.first(), chance.last(), chance.email()]);
    }

    righto(batch, `
      INSERT INTO test (id, firstName, lastName, email) VALUES (?, ?, ?, ?)
    `, entries, connection)(
      function (error, result) {
        console.log('finished', error, result);
      }
    );
  }

  insertBatch();
});
