// Copyright (c) 2018, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
'use strict'

const db = require('../utils/knex')
const axios = require('axios')
const geoip = require('geoip-lite')

try {
    setInterval(async function() {

        let knownNodes
        const getNodes = await db('nodes')
        .select()
        .where('available', true)

        // Bootstrap this bitch
        if(getNodes.length >= 1) {
            knownNodes = getNodes
        } else {
            knownNodes = [{ address: '145.131.30.157:11897' }]
        }

        knownNodes.forEach(async function(node) {

            // Grab other peers 
            const rpcAddress = 'http://' + node.address.split(':')[0] + ':' + (+node.address.split(':')[1] + 1)

            try {
                const getPeers = await axios.get(rpcAddress + '/getpeers')

                var peers = []
    
                getPeers.data.peers.forEach(async function(peer) {
                    peers.push(peer)
                })

                // Store only 2
                peers = peers.slice(0, 2)

    
                peers.forEach(async function(peer) {

                    let available
                    var peerIp = peer.split(':')[0]
                    var peerPort = peer.split(':')[1]
                    var peerRpc = 'http://' + peerIp + ':' + (+peerPort + 1 + '/getinfo')
                    var geo = await geoip.lookup(peerIp)

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


                    var data = [
                        peer,
                        JSON.stringify(peers),
                        available,
                        geo.country,
                        geo.region,
                        geo.city,
                        JSON.stringify(geo.ll),
                        Date.now(),
                        Date.now(),
                        JSON.stringify(peers),
                        available,
                        geo.country,
                        geo.region,
                        geo.city,
                        JSON.stringify(geo.ll),
                        Date.now()
                    ]
                    console.log(data)

                    await db.raw('INSERT INTO nodes (address, peers, available, country, region, city, coordinates, seen, created) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (address) DO UPDATE SET peers = ?, available = ?, country = ?, region = ?, city = ?, coordinates = ?, seen = ?', data)
                })
            }
            catch(err) {
                console.error(err)

            }
        })
    }, 3000)
}
catch(err) {
     console.error(err)
}
