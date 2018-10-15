// Copyright (c) 2018, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
'use strict'

const express = require('express')
const router = express.Router()
const db = require('../utils/knex')
const moment = require('moment'
)
router.get('/', async function (req, res, next) {
	try {

		const lastSeen = await db('nodes')
		.select('seen')
		.orderBy('seen', 'desc')
		.limit(1)

		const countNodes = await db('nodes')
		.count('* as count')

		res.render('map', {
			updated: moment(lastSeen[0].seen).fromNow(),
			total: countNodes[0].count
		})
	}
	catch(err) {
		next(err)
		console.log(err)
	}
})

router.get('/data', async function (req, res, next) {
	try {
		const getNodes = await db('nodes').select()
		res.json(getNodes)
		
	}
	catch(err) {
		res.json(null)
		console.log(err)
	}
})

module.exports = router
