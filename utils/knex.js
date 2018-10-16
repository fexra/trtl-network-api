// Copyright (c) 2018, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
'use strict'

const knex = module.exports = require('knex')({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        port: 5432,
        user : 'fexra',
        password : '8761',
        database : 'fexra'
      }
})

module.exports = knex
