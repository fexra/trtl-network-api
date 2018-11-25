// Copyright (c) 2018, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
'use strict'

const express = require('express')
const router = express.Router()
const db = require('../utils/knex')
const moment = require('moment')

router.get('/peers', async function (req, res, next) {
	try {
		const start = moment().subtract('1', 'day').valueOf()
		const end = moment().valueOf()

		const getNodes = await db('nodes')
		.select('address', 'peers', 'coordinates', 'seen',)
		.whereBetween('seen', [+start, +end])

		getNodes.forEach(function(node) {
			node.peers = JSON.parse(node.peers)
			node.coordinates = JSON.parse(node.coordinates)
			node.seen = moment(node.seen).fromNow()
		})

		res.status(200).json(getNodes)
	}
	catch(err) {
		res.status(err.status).json(err.message)
	}
})

module.exports = router
