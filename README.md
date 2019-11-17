# sqlite-fp
[![Build Status](https://travis-ci.org/markwylde/sqlite-fp.svg?branch=master)](https://travis-ci.org/markwylde/sqlite-fp)
[![David DM](https://david-dm.org/markwylde/sqlite-fp.svg)](https://david-dm.org/markwylde/sqlite-fp)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/markwylde/sqlite-fp)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/markwylde/sqlite-fp)](https://github.com/markwylde/sqlite-fp/releases)
[![GitHub](https://img.shields.io/github/license/markwylde/sqlite-fp)](https://github.com/markwylde/sqlite-fp/blob/master/LICENSE)

A wrapper around sqlite in a functional programming style

## Installation
```bash
npm install --save sqlite-fp
```

## Example
### With callbacks
```javascript
const connect = require('sqlite-fp/connect')
const execute = require('sqlite-fp/execute')
const getAll = require('sqlite-fp/getAll')

function getTestRecords (callback) {
  connect(':memory:', function (error, connection) {
    if (error) { return callback(error) }
    execute('CREATE TABLE lorem (info TEXT)', connection, function (error, tableCreated) {
      if (error) { return callback(error) }
      getAll('SELECT * FROM test', connection, function (error, testResults) {
        if (error) { return callback(error) }
        callback(null, testResults)
      })
    })
  })
}

getTestRecords(function (error, testRecords) {
  if (error) {
    throw error
  }
  console.log(testRecords)
})
```

### With [righto](https://github.com/KoryNunn/righto)
```javascript
const righto = require('righto')
const connect = require('sqlite-fp/connect')
const execute = require('sqlite-fp/execute')
const getAll = require('sqlite-fp/getAll')

const connection = righto(connect, ':memory:')
const tableCreated = righto(execute, 'CREATE TABLE lorem (info TEXT)', connection)
const testResults = righto(getAll, 'SELECT * FROM test', connection, righto.after(tableCreated))

testResults(function (error, results) {
  if (error) {
    throw error
  }

  console.log(results)
})
```

Streaming records one at a time
```javascript
const righto = require('righto')
const connect = require('sqlite-fp/connect')
const execute = require('sqlite-fp/execute')
const getEach = require('sqlite-fp/getEach')

const connection = righto(connect, ':memory:')
const tableCreated = righto(execute, 'CREATE TABLE lorem (info TEXT)', connection)
const rowStream = righto(getEach, 'SELECT * FROM test', connection, righto.after(tableCreated))

rowStream(function (error, forEachRow) {
  if (error) {
    return console.log('ERROR: ', error)
  }

  forEachRow(function (row) {
    console.log(row)
  })
})
```

## Functions signatures
### connect -> filename -> [mode] -> (error, connection)
### run -> sql -> [parameters] -> connection -> (error, result={lastId, changes})
### getAll -> sql -> connection -> (error, rows)
### getOne -> sql -> connection -> (error, row)
### getEach -> sql -> [parameters] -> connection -> (error, forEachRow -> (row))
### batch -> sql -> [[parameters]] -> connection -> (error, result={lastId, changes})
### execute -> sql -> connection -> (error, connection)

## License
This project is licensed under the terms of the MIT license.
