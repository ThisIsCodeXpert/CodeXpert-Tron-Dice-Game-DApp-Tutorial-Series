# Tron DApp Template


> For basic tutorial series, checkout video tutorial series -

> Best Tron (TRX) DApp Tutorial Series for Beginners : https://www.youtube.com/playlist?list=PLL5pYVd8AWtRDnTTKWzPpFcBT9nrPCQt6

------------------------

## Instructions :

Install TronLink chrome extension in browser.

```
$ npm install -g tronbox
$ npm install -g tronweb
```

Add Private key to tronbox.js from shasta test network account of TronLink.

```
$ tronbox compile --compile-all
$ tronbox migrate --reset --network shasta
```

Paste (base58) key of SmartContract in Line 1 of src/utils/index.js

```
$ npm install
$ yarn
$ yarn start
```

checkout your  dapp at http://localhost:3000/

------------------------
