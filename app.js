// Copyright (c) 2018, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
'use strict'

// Set Express App
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Helmet = require('helmet')
const Compression = require('compression')
const favicon = require('serve-favicon')
const path = require('path')
const logger = require('morgan')
const fs = require('fs')

// Compress
app.use(Helmet())
app.use(Compression())

//Set Parsers/Path/Favicon/Templates
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))

//Set Schema
require('./utils/schema')

//Routes
const index = require('./routes/index')

app.use('/', index)

//Load script
require('./scripts/findNodes')

// error handler
app.use(function onError (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = process.env.DEBUG == true ? err : {}
  res.statusCode = err.status || 500
  res.render(err)
})

module.exports = app
