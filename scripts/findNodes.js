// Copyright (c) 2018, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
'use strict'

const cron = require('node-cron');
const db = require('../utils/knex')
const knownNodes = require('../config/nodes')
const axios = require('axios')
const geoip = require('geoip-lite')

try {
    cron.schedule('*/10 * * * *', async function() {

        knownNodes.forEach(async function(node) {
            const getNode = await axios.get(node + '/getpeers')

            if(getNode.data.status === 'OK') {

                getNode.data.peers.forEach(async function(peer) {

                    const ip = peer.split(':')[0]
                    const port = peer.split(':')[1]
                    const geo = await geoip.lookup(ip)

                    const findNode = await db('nodes')
                    .count('* as count')
                    .where('ip', ip)
                    .where('port', port)

                    if(findNode[0].count >= 1) {
                        await db('nodes').update({
                            country: geo.country,
                            region: geo.region,
                            city: geo.city,
                            coordinates: JSON.stringify(geo.ll),
                            seen: Date.now()
                        })
                        .where('ip', ip)
                        .where('port', port)
                        .limit(1)
                    } else {
                        await db('nodes').insert({
                            ip: ip,
                            port: port,
                            country: geo.country,
                            region: geo.region,
                            city: geo.city,
                            coordinates: JSON.stringify(geo.ll),
                            seen: Date.now(),
                            created: Date.now()
                        })
                    }
                })
            }
        })
    })
}
catch(err) {
    console.log(err)
}
