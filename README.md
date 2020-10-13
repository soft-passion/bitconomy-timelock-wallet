# Biconomy Time Locked Smart Contract Wallet

This repo is to create  a Time Locked Smart Contract Wallet on Kovan Network which allows anyone to deposit ERC20 or Ether in a smart contract locked for a certain interval of time, post which receiver can claim those tokens/ether.

Claim operation is meta transaction enabled with Biconomy.
## Features
- user can stake eth or token in time lock wallets for a certain time he decides , 
- user when login, can see list of wallets associated with his ethereum address 
- for each wallet, user can claim his funds gasless  
- mint tokens function is supported for testing 
## Installation

1. First clone this repo.
    ```javascript
    cd app
    // using npm
    // make sure you have node version 11  
    npm install 
    // using yarn 
    yarn install
    ```
2. Run the app locally.
    ```javascript
    npm start
    ```


## Testing
 To test the smart contract .
 
 Truffle can run tests written in  JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.
```javascript
// test 
test

//outside the development console
truffle test
```

## FAQ


* __Where do I find more information about Biconomey?__

    Check out the [documentation](https://docs.biconomy.io/).

* __Where do I find more information about Drizzle?__

    Check out the [documentation](http://truffleframework.com/docs/drizzle/getting-started) or any of the three repositories ([`drizzle`](https://github.com/trufflesuite/drizzle), [`drizzle-react`](https://github.com/trufflesuite/drizzle-react), [`drizzle-react-components`](https://github.com/trufflesuite/drizzle-react-components)).

* __Where is my production build?__

    The production build will be in the `app/build` folder after running `npm run build` in the `app` folder.

* __Where can I find more documentation?__

    This box is a marriage of [Truffle](http://truffleframework.com/) and a React setup created with [create-react-app](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md). Either one would be a great place to start!
## Credits
All the UI credits goes to

 [drizzle-box](https://github.com/truffle-box/drizzle-box)  
 [drimble-ui](https://github.com/ConsenSysMesh/rimble-ui) 
 
All the time Lock wallet credits goes to [uport-time-locked-wallets](https://github.com/radek1st/uport-time-locked-wallets) 

All the Meta transaction  credits goes to [metatx-standard](https://github.com/bcnmy/metatx-standard) 