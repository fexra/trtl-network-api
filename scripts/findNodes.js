// Copyright (c) 2018, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
'use strict'

const cron = require('node-cron');
const db = require('../utils/knex')
const axios = require('axios')
const geoip = require('geoip-lite')
const check = require('is-reachable')
try {
    cron.schedule('*/10 * * * *', async function() {

        let knownNodes
        const getNodes = await db('nodes')
        .select()
        .where('public', true)

        if(getNodes.length >= 1) {
            knownNodes = getNodes
        } else {
            knownNodes = [{ address: '145.131.30.157:11897' }]
        }

        knownNodes.forEach(async function(node) {

            const rpcAddress = 'http://' + node.address.split(':')[0] + ':' + (+node.address.split(':')[1] + 1)

            try {
                const getPeers = await axios.get(rpcAddress + '/getpeers')

                const peers = []
    
                getPeers.data.peers.forEach(async function(peer) {
                    peers.push(peer)
                })

                //getPeers.data.gray_peers.forEach(async function(peer) {
                //    peers.push(peer)
                //})
    
                peers.forEach(async function(peer) {

                    let available
                    var peerIp = peer.split(':')[0]
                    var peerPort = peer.split(':')[1]
                    var peerRpc = 'http://' + peerIp + ':' + (+peerPort + 1 + '/getinfo')
                    var peerGeo = await geoip.lookup(peerIp)

                    try {
                        const peerCheck =  await axios.get(peerRpc)
                        if(peerCheck.status === 200) {
                            available = true
                        } else {
                            available = false
                        }
                    }
                    catch(err) {
                        available = false
                    }

                    console.log(available)
                    var data = [
                        peer,
                        JSON.stringify(getPeers.data.peers),
                        available,
                        peerGeo.country,
                        peerGeo.region,
                        peerGeo.city,
                        JSON.stringify(peerGeo.ll),
                        JSON.stringify(node.address),
                        Date.now(),
                        Date.now(),
                        JSON.stringify(getPeers.data.peers),
                        peerGeo.country,
                        peerGeo.region,
                        peerGeo.city,
                        JSON.stringify(peerGeo.ll),
                        JSON.stringify(node.address),
                        Date.now()
                    ]
    
                    await db.raw('INSERT INTO nodes (address, peers, public, country, region, city, coordinates, trail, seen, created) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (address) DO UPDATE SET peers = ?, country = ?, region = ?, city = ?, coordinates = ?, trail = nodes.trail || ?::JSONB, seen = ?', data)
                })
            }
            catch(err) {
console.log(err)

            }
        })
    })
}
catch(err) {
//   console.log(err)
}
