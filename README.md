# full-node-parallel-test

This repository contains a simple test to see if there is any difference
between parallel and series calls to a full node. I wrote it to prove out
a bug, but the result was that the bug didn't exist the way I expected. That's
the advantage of writing investigative tests like this.

## Installation
* Clone this repository
* Install dependencies: `npm install`

## Usage
* Edit the `index.js` file with the login credentials for you full node.
* Run the test with `node index.js`
