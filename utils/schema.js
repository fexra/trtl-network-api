// Copyright (c) 2018, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
'use strict'

const db = require('../utils/knex')

//Create 'nodes' table if it does not exist
db.schema.hasTable('nodes').then(function(exists) {
    if (!exists) {
      return db.schema.createTable('nodes', function(table) {
        table.increments()
        table.unique('ip')
        table.string('ip')
        table.integer('port')
        table.string('country')
        table.string('region')
        table.string('city')
        table.json('coordinates')
        table.datetime('seen')
        table.datetime('created')
    })
  }
})