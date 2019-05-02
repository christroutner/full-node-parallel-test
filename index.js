/*
  A demo for displaying issues with parallel calls to a BCH full node.
*/

'use strict'

const axios = require('axios')

// Used for debugging and iterrogating JS objects.
const util = require("util");
util.inspect.defaultOptions = {depth: 1};

// Customize these variables for your own full node.
const NODEIP = '127.0.0.1'
const NODEPORT = '8332'
const USERNAME = 'bitcoin'
const PASSWORD = 'password'

const addresses = [
  `bitcoincash:qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c`,
  `bitcoincash:qrehqueqhw629p6e57994436w730t4rzasnly00ht0`,
  `bitcoincash:qrd2zk5m09u9tqaj5v8kyr6jkksl2pj7gvyjjxkt9f`,
  `bitcoincash:qpmnu48n9ef7gx2fmkd8d5qxnyv742kayye3gqh7j8`,
  `bitcoincash:qql5mcm78ftt53epr35exkwln448qv3q0cqnmf0j2v`
]
console.log(`Input addresses: ${JSON.stringify(addresses,null,2)}`)
console.log(` `)

// Makes parallel calls to the full node.
async function parallelCall() {
  const promises = []

  // Make a series of JSON RPC calls and generate an array of promises.
  for(let i=0; i < addresses.length; i++) {
    const address = addresses[i]

    const promise = axios({
      url: `http://${NODEIP}:${NODEPORT}/`,
      method: "post",
      auth: {
        username: USERNAME,
        password: PASSWORD
      },
      data: {
        jsonrpc: "1.0",
        id: "validateaddress",
        method: "validateaddress",
        params: [address]
      }
    })

    promises.push(promise)
  }

  // Wait until all parallel calls complete.
  const results = await Promise.all(promises)

  // Go through each returned result and display it.
  for(let i=0; i < results.length; i++) {
    const result = results[i]

    console.log(`parallel address ${i} returned: ${result.data.result.address}`)
  }
}
//parallelCall()

// Makes series calls to the full node.
async function seriesCall() {
  const results = []

  // Make a series of JSON RPC calls, but wait until each one completes before
  // making the next one.
  for(let i=0; i < addresses.length; i++) {
    const address = addresses[i]

    const result = await axios({
      url: `http://${NODEIP}:${NODEPORT}/`,
      method: "post",
      auth: {
        username: USERNAME,
        password: PASSWORD
      },
      data: {
        jsonrpc: "1.0",
        id: "validateaddress",
        method: "validateaddress",
        params: [address]
      }
    })

    results.push(result.data.result)
  }

  // Go through each returned result and display it.
  for(let i=0; i < results.length; i++) {
    const result = results[i]

    console.log(`series address ${i} returned: ${result.address}`)
  }
}
//seriesCall()

async function runTest() {
  await parallelCall()

  console.log(` `)

  await seriesCall()
}
runTest()
