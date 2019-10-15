// Copyright (c) 2018-2019, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

'use strict'

const moment = require('moment')
const DB = require('../lib/db')
const Network = require('../lib/network')

const db = new DB()
const network = new Network()


async function t() {

    // insert seed node - it has to start somewhere
    let seedNode = '145.131.30.157:11897'
    let checkSeed = await db.fetchNodes()

    if(checkSeed.length <= 0) {
        await db.insertNode(seedNode)
    }
 
  // Get all stored nodes that have been last seen 24 hours +
  let cutoff = moment().subtract('1', 'minute').valueOf()
  let storedNodes = await db.fetchNodes() 

  // collect peer node for each stored node

  storedNodes.map(async node => {
    let peerNodes = await network.getPeers(node.address)

    // if not peer list, no connection
    if(peerNodes.length <= 0) {
      await db.updateNodeAvailability(node.address, false)
    } else {

      await db.updateNodeAvailability(node.address, true)

      // store/update & link/update 'em
      peerNodes.map(async nodeAddress => {
        let nodeId = await db.insertNode(nodeAddress)

        if(nodeId != 0) {
          await db.insertLink(node.id, nodeId)
        }
      })
    }
  })

 /*
  // locate all nodes seen 24 hours or more
  let cutoff = moment().subtract('1', 'day').valueOf()
  let oldNodes = await db.fetchNodes(cutoff)

  oldNodes.map(async node => {
    let nodeGeo = await network.locateNode(node.address)
    await db.updateNodeGeo(node.address, nodeGeo)
    console.log('located node ' + node.address)
  })

  */
}

//t()
