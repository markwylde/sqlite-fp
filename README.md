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
    execute(connection, 'CREATE TABLE lorem (info TEXT)', function (error, tableCreated) {
      if (error) { return callback(error) }
      getAll(connection, 'SELECT * FROM test', function (error, testResults) {
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
const tableCreated = righto(execute, connection, 'CREATE TABLE lorem (info TEXT)')
const testResults = righto(getAll, connection, 'SELECT * FROM test', righto.after(tableCreated))

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
const tableCreated = righto(execute, connection, 'CREATE TABLE lorem (info TEXT)')
const rowStream = righto(getEach, connection, 'SELECT * FROM test', righto.after(tableCreated))

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
### run -> connection -> sql -> [parameters] -> (error, result={lastId, changes})
### getAll -> connection -> sql -> (error, rows)
### getOne -> connection -> sql -> (error, row)
### getEach -> connection -> sql -> [parameters] -> (error, forEachRow -> (row))
### batch -> connection -> sql -> [[parameters]] -> (error, result={lastId, changes})
### execute -> connection -> sql -> (error, connection)
### close -> connection -> (error)

## License
This project is licensed under the terms of the MIT license.
