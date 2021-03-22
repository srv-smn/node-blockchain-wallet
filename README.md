# Blockchain Wallet
This is a node API which connects to blockchain network
- user can create account 
- verify email
- login into their wallet using password/OTP
- on successful signup user can claim 1 Token into their wallet 
- verified user can transfer Token just by specifying the email of recipient
- sender and receiver will get email notification on successful Token transfer


### Library Used
- `express` 
    - to build a server 
- `mongodb`
    - MongoDB Driver
- `mongoose`
    - to establish connection between DB and Node Js
- `multer`
    - To perform operations on multimedia file 
- `validator`
    - To perform data validation 
- `bcryptjs`
    - Encrypting the password
- `jsonwebtoken`
    - managing the sessions
- `bable`
    - To use ES6 syntax 
- `@truffle/hdwallet-provider`
    - used in truffle config for connection with blockchain
- `@sendgrid/mail`
    - To send Email
- `multer`
    - dealing with multimedia file
- `sharp`
    - manipulating the multimedia
- `validator`
    - data validation 
- `truffle/hdwallet-provider`
    - Sign transaction and interact with contract 
- `web3`
    - Connection with blockchain
- `openzeppelin-solidity`
    - used for importing the contracts from it 
- `truffle-plugin-verify`
    - used to verify contract on network
- `bip39`
    - used to create mnemonic for ethereum wallet
- Dev Dependencies 
    - `nodemon`
        - to keep server running while development 
    - `dotenv`
        - used in truffle config to setup and use environment variable  
    - `env-cmd`
        - setup and use environment variable 

## Files and Directory
- config folder
    - contains dot.env file which contains environment varialbe like RINKEBY,MONGODB_URL... 
- Migration folder
    - File required to deploy code to Blockchain
- src folder
    - abis folder
        - contains the ABI's co smart contract
    - contract folder
        - contains the smart contracsts
    - api folder
        - db folder
            - contains the `mongoose.js` file which the logic for connecting with DB
        - email folder
            - contains the `mail.js` file which the logic for sending login OTP, signup OTP, sending Token OTP, receiving Token OTP
        - ethereum folder
            - `token.js`
                - establishing connection with Token smart contract
            - `web3.js`
                - configuring Web3 according to requirement
        - middleware folder
            - `auth.js`
                - checks for bearer token (ie. if the person is logedIn or not)
            - `verified.js`
                - checkes if the user account is verified or not 
        - model folder
            - `transaction.js`
                - Transaction Schema 
            - `user.js`
                - user schema
        - routers folder
            - `transaction.js`
                - contains transaction related route
            - `user.js`
                - contains user related routes
        - utils folder
            - `signupBonus.js`
                - contains the logic for giving the signup bonus to verified user
            - `transactionHelper.js`
                - contains logic or transfering Token between accounts
            - `userHelper.js`
                - contains logic to return address from phrase

### Commands 
- `truffle compile` - to compile smart contract
- `truffle migrate --network <network>` - to deploy code on to specified network
- `truffle run verify <contract name> --network <network name>` - verify code on to the network 
- `npm start` - to run the server at PORT 3000

### environment variable to be set in config/dev.env file (used by server side code)
- PORT
- SENDGRID_API_KEY
- MONGODB_URL
- JWT_SECRET
- RINKEBY=
- ADMIN_PHRASE
- ROPSTEN

### environment variable to be set in .env file (used by truffle code)

- MNEMONIC
- RINKEBY
- ROPSTEN
- ETHERSCAN_API

Token verified on Rinkeby: https://rinkeby.etherscan.io/address/0x8f17e7a68ae412D1D9F37B2C83BdC070B32a8dE7

Token Verified on Ropsten: https://ropsten.etherscan.io/token/0xFb2866A839001078da182f0aC3b9ED524Cef681E          

