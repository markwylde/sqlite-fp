const righto = require('righto');

const test = require('tape');
const connect = require('../connect');
const run = require('../run');
const execute = require('../execute');
const getAll = require('../getAll');
const getOne = require('../getOne');
const close = require('../close');

test('connect', t => {
  t.plan(1);

  connect(':memory:', function (_, db) {
    t.deepEqual(db, {
      open: false,
      filename: ':memory:',
      mode: 65542
    });
  });
});

test('run: incorrect sql', t => {
  t.plan(1);

  const connection = righto(connect, ':memory:');
  const tableCreated = righto(run, connection, '_WRONG SQL');

  tableCreated(function (error, success) {
    t.equal(error.toString(), 'Error: SQLITE_ERROR: near "_WRONG": syntax error');
  });
});

test('run', t => {
  t.plan(1);

  const connection = righto(connect, ':memory:');
  const tableCreated = righto(run, connection, 'CREATE TABLE lorem (info TEXT)');

  tableCreated(function (error, result) {
    t.notOk(error);
  });
});

test('run with changes and lastID', t => {
  t.plan(2);

  const connection = righto(connect, ':memory:');
  const tableCreated = righto(run, connection, 'CREATE TABLE lorem (info TEXT)');
  const recordInserted = righto(run, connection, `
    INSERT INTO lorem (info) VALUES ('test')
  `, righto.after(tableCreated));

  recordInserted(function (error, result) {
    t.deepEqual(result, {
      lastID: 1,
      changes: 1
    });
    t.notOk(error);
  });
});

test('execute: incorrect sql', t => {
  t.plan(1);

  const connection = righto(connect, ':memory:');
  const tableCreated = righto(execute, connection, '_WRONG SQL');

  tableCreated(function (error, success) {
    t.equal(error.toString(), 'Error: SQLITE_ERROR: near "_WRONG": syntax error');
  });
});

test('execute', t => {
  t.plan(1);

  const connection = righto(connect, ':memory:');
  const tableCreated = righto(execute, connection, 'CREATE TABLE lorem (info TEXT)');

  tableCreated(function (error) {
    t.notOk(error);
  });
});

test('getAll: incorrect sql', t => {
  t.plan(1);

  const connection = righto(connect, ':memory:');
  const tableCreated = righto(execute, connection, 'CREATE TABLE lorem (info TEXT)');
  const getRecords = righto(getAll, connection, '_WRONG SQL', righto.after(tableCreated));

  getRecords(function (error) {
    t.equal(error.toString(), 'Error: SQLITE_ERROR: near "_WRONG": syntax error');
  });
});

test('getAll: no records', t => {
  t.plan(2);

  const connection = righto(connect, ':memory:');
  const tableCreated = righto(execute, connection, 'CREATE TABLE lorem (info TEXT)');
  const getRecords = righto(getAll, connection, 'SELECT * FROM lorem', righto.after(tableCreated));

  getRecords(function (error, rows) {
    t.notOk(error);
    t.deepEqual(rows, []);
  });
});

test('getAll: one record', t => {
  t.plan(2);

  const connection = righto(connect, ':memory:');
  const tableCreated = righto(execute, connection, 'CREATE TABLE lorem (info TEXT)');

  const recordInserted = righto(execute, connection, `
    INSERT INTO lorem (info) VALUES ('test')
  `, righto.after(tableCreated));

  const getRecords = righto(getAll, connection, 'SELECT * FROM lorem', righto.after(recordInserted));

  getRecords(function (error, rows) {
    t.notOk(error);
    t.deepEqual(rows, [{ info: 'test' }]);
  });
});

test('getAll: multiple records', t => {
  t.plan(2);

  const connection = righto(connect, ':memory:');
  const tableCreated = righto(execute, connection, 'CREATE TABLE lorem (info TEXT)');

  const firstRecordInserted = righto(execute, connection, `
    INSERT INTO lorem (info) VALUES ('test1')
  `, righto.after(tableCreated));

  const secondRecordInserted = righto(execute, connection, `
    INSERT INTO lorem (info) VALUES ('test2')
  `, righto.after(tableCreated));

  const getRecords = righto(getAll, connection,
    'SELECT * FROM lorem',
    righto.after(firstRecordInserted, secondRecordInserted)
  );

  getRecords(function (error, rows) {
    t.notOk(error);
    t.deepEqual(rows, [
      { info: 'test1' },
      { info: 'test2' }
    ]);
  });
});

test('getOne: incorrect sql', t => {
  t.plan(1);

  const connection = righto(connect, ':memory:');
  const tableCreated = righto(getOne, connection, '_WRONG SQL');

  tableCreated(function (error) {
    t.equal(error.toString(), 'Error: SQLITE_ERROR: near "_WRONG": syntax error');
  });
});

test('getOne: no records', t => {
  t.plan(2);

  const connection = righto(connect, ':memory:');
  const tableCreated = righto(getOne, connection, "SELECT * FROM sqlite_master WHERE type='table'");

  tableCreated(function (error, row) {
    t.notOk(error);
    t.notOk(row);
  });
});

test('getOne: multiple records', t => {
  t.plan(2);

  const connection = righto(connect, ':memory:');
  const tableCreated = righto(execute, connection, 'CREATE TABLE lorem (info TEXT)');

  const firstRecordInserted = righto(execute, connection, `
    INSERT INTO lorem (info) VALUES ('test1')
  `, righto.after(tableCreated));

  const secondRecordInserted = righto(execute, connection, `
    INSERT INTO lorem (info) VALUES ('test2')
  `, righto.after(tableCreated));

  const getRecords = righto(getOne, connection,
    'SELECT * FROM lorem',
    righto.after(firstRecordInserted, secondRecordInserted)
  );

  getRecords(function (error, row) {
    t.notOk(error);
    t.deepEqual(row, {
      info: 'test1'
    });
  });
});

test('close: database', t => {
  t.plan(2);

  const connection = righto(connect, ':memory:');

  const closedConnection = righto(close, connection, righto.after(connection));

  closedConnection(function (error, result) {
    t.notOk(error);
    t.notOk(result);
  });
});
