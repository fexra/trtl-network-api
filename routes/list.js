// Copyright (c) 2018, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
'use strict'

const express = require('express')
const router = express.Router()
const db = require('../utils/knex')
const moment = require('moment')

router.get('/', function (req, res, next) {
	res.redirect('/list/0/10')
})


router.get('/:start/:end', async function (req, res, next) {
	try {
		const start = +req.params.start
		const end = +req.params.end
		const limit = end - start

		if(limit > 10) {
			res.redirect('/list/0/10')
		}

		const next = end + '/' + (end + limit)
		let prev

		if(start === 0) {
			prev = '0/10'
		} else {
			prev = start - limit + '/' + start
		}

		const getNodes = await db('nodes')
		.select()
		.orderBy('seen', 'desc')
		.limit(limit)
		.offset(start)

		const countNodes = await db('nodes')
		.count('* as count')

		getNodes.forEach(function(node) {
			node.seen = moment(node.seen).fromNow()
		})
	
		res.render('list', {
			nodes: getNodes,
			next: next,
			prev: prev,
			start: start,
			end: end,
			limit: limit,
			total: countNodes[0].count
		})
	}
	catch(err) {
		next(err)
		console.log(err)
	}
})

module.exports = router
