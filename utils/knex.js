// Copyright (c) 2018, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
'use strict'

const knex = module.exports = require('knex')({
    client: 'pg',
    connection: {
        host : process.env.DB_HOST,
        port: process.env.DB_PORT,
        user : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME
      }
})

module.exports = knex
