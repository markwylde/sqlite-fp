const righto = require('righto')

const test = require('tape')
const connect = require('../connect')
const run = require('../run')
const execute = require('../execute')
const getAll = require('../getAll')
const getOne = require('../getOne')

test('connect', t => {
  t.plan(1)

  connect(':memory:', function (_, db) {
    t.deepEqual(db, {
      open: false,
      filename: ':memory:',
      mode: 65542
    })
  })
})

test('run: incorrect sql', t => {
  t.plan(1)

  const connection = righto(connect, ':memory:')
  const tableCreated = righto(run, '_WRONG SQL', connection)

  tableCreated(function (error, success) {
    t.equal(error.toString(), 'Error: SQLITE_ERROR: near "_WRONG": syntax error')
  })
})

test('run', t => {
  t.plan(1)

  const connection = righto(connect, ':memory:')
  const tableCreated = righto(run, 'CREATE TABLE lorem (info TEXT)', connection)

  tableCreated(function (error) {
    t.notOk(error)
  })
})

test('execute: incorrect sql', t => {
  t.plan(1)

  const connection = righto(connect, ':memory:')
  const tableCreated = righto(execute, '_WRONG SQL', connection)

  tableCreated(function (error, success) {
    t.equal(error.toString(), 'Error: SQLITE_ERROR: near "_WRONG": syntax error')
  })
})

test('execute', t => {
  t.plan(1)

  const connection = righto(connect, ':memory:')
  const tableCreated = righto(execute, 'CREATE TABLE lorem (info TEXT)', connection)

  tableCreated(function (error) {
    t.notOk(error)
  })
})

test('getAll: incorrect sql', t => {
  t.plan(1)

  const connection = righto(connect, ':memory:')
  const tableCreated = righto(execute, 'CREATE TABLE lorem (info TEXT)', connection)
  const getRecords = righto(getAll, '_WRONG SQL', connection, righto.after(tableCreated))

  getRecords(function (error) {
    t.equal(error.toString(), 'Error: SQLITE_ERROR: near "_WRONG": syntax error')
  })
})

test('getAll: no records', t => {
  t.plan(2)

  const connection = righto(connect, ':memory:')
  const tableCreated = righto(execute, 'CREATE TABLE lorem (info TEXT)', connection)
  const getRecords = righto(getAll, 'SELECT * FROM lorem', connection, righto.after(tableCreated))

  getRecords(function (error, rows) {
    t.notOk(error)
    t.deepEqual(rows, [])
  })
})

test('getAll: one record', t => {
  t.plan(2)

  const connection = righto(connect, ':memory:')
  const tableCreated = righto(execute, 'CREATE TABLE lorem (info TEXT)', connection)

  const recordInserted = righto(execute, `
    INSERT INTO lorem (info) VALUES ('test')
  `, connection, righto.after(tableCreated))

  const getRecords = righto(getAll, 'SELECT * FROM lorem', connection, righto.after(recordInserted))

  getRecords(function (error, rows) {
    t.notOk(error)
    t.deepEqual(rows, [{ info: 'test' }])
  })
})


test('getAll: multiple records', t => {
  t.plan(2)

  const connection = righto(connect, ':memory:')
  const tableCreated = righto(execute, 'CREATE TABLE lorem (info TEXT)', connection)

  const firstRecordInserted = righto(execute, `
    INSERT INTO lorem (info) VALUES ('test1')
  `, connection, righto.after(tableCreated))

  const secondRecordInserted = righto(execute, `
    INSERT INTO lorem (info) VALUES ('test2')
  `, connection, righto.after(tableCreated))

  const getRecords = righto(getAll,
    'SELECT * FROM lorem', connection,
    righto.after(firstRecordInserted, secondRecordInserted)
  )

  getRecords(function (error, rows) {
    t.notOk(error)
    t.deepEqual(rows, [
      { info: 'test1' },
      { info: 'test2' }
    ])
  })
})


test('getOne: incorrect sql', t => {
  t.plan(1)

  const connection = righto(connect, ':memory:')
  const tableCreated = righto(getOne, '_WRONG SQL', connection)

  tableCreated(function (error) {
    t.equal(error.toString(), 'Error: SQLITE_ERROR: near "_WRONG": syntax error')
  })
})

test('getOne: no records', t => {
  t.plan(2)

  const connection = righto(connect, ':memory:')
  const tableCreated = righto(getOne, `SELECT * FROM sqlite_master WHERE type='table'`, connection)

  tableCreated(function (error, row) {
    t.notOk(error)
    t.notOk(row, null)
  })
})
