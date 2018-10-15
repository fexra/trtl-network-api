// Copyright (c) 2018, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
'use strict'

const knex = module.exports = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './db/nodes.db'
    }
})

module.exports = knex
