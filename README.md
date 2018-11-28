# IDHUB Interview Assignment

## Assigment description
A. 會員身份 Smart Contract
1. 用 Solidity 寫，具備基本的會員系統功能：註冊、編輯個人資料、聲明、授權、恢復私鑰。
  - [x] 註冊
  - [x] 編輯個人資料
  - [x] 聲明
  - [x] 授權
  - [x] 恢復私鑰

2. 加分項：
  - [x] 付款
  - [ ] 好友功能
  - [x] Deploy 到 Ethereum 的測試鏈
  - [ ] Smart Contract 安全稽核
  - [ ] API server
  - [ ] 效能評估


B. 文章閱讀
1. [Hyperledger indy-node](https://github.com/hyperledger/indy-node/blob/stable/getting-started.md)
  * [x] [內容大意](./docs/indy-node.1.md)
  * [x] [讀後心得](./docs/indy-node.2.md)
2. [OriginTrail-White-Paper](https://origintrail.io/storage/documents/OriginTrail-White-Paper.pdf)
  * [x] [內容大意](./docs/OriginTrail.1.md
  * [x] [讀後心得](./docs/OriginTrail.2.md)


## 會員身份 Smart Contract

### Ropsten testnet (id: 3)
|Contract|Address|
| --|--|
|[IdentityManager](./contracts/IdentityManager.sol)|[0xdd90eed19e4ea80be2bc9faef6ccbe501aac876b](https://ropsten.etherscan.io/address/0xdd90eed19e4ea80be2bc9faef6ccbe501aac876b)|
|[TxRelay](./contracts/TxRelay.sol)|[0xa6aaa977c4a4b4d559d7be2c748a865633943224](https://ropsten.etherscan.io/address/0xa6aaa977c4a4b4d559d7be2c748a865633943224)|
|[MetaIdentityManager](./contracts/MetaIdentityManager.sol)|[0xb2c2de415b1653d66231ec5876ae43b7094921bb](https://ropsten.etherscan.io/address/0xb2c2de415b1653d66231ec5876ae43b7094921bb)|
|[ProfileManager](./contracts/ProfileManager.sol)|[0x639f3b90c65bcd79659fdd4f149e565a4d056b75](https://ropsten.etherscan.io/address/0x639f3b90c65bcd79659fdd4f149e565a4d056b75)|
|[ClaimManager](./contracts/ClaimManager.sol)|[0x6e0e2863322a9977604db4634bd5fa10b599405f](https://ropsten.etherscan.io/address/0x6e0e2863322a9977604db4634bd5fa10b599405f)|

### How to run this project

1. Install npm packages
```
npm install
```

2. Run test on local ganache(testRPC)
```
truffle test --network local
```

3. Deply to testnet
```
truffle migrate --network ropsten
```

### Contract interaction
All the contracts has deployed on ropsten network. And verify code on etherscan. You can interact with contract through it. 

1. Registration
    
    Call `registerIdentity` to MetaIdentityManager contract with owner and recoveryKey address parameters. 
    
    example tx: 0x4137f941e143b00712ac33097cf095bdf55f3ebdcb6b5c0f3e27f5809c74f84c
    example identity: 0xcf430b62fb096c0fadcfebe827a13b26d8056569

2. Edit profile
    
    Call `setName` to ProfileManager contract with identity address and specific name parameters.

    example tx: 0xe277cedc3712034e35ee33f1a5a4b5c324070df06069ebfa1fbbef6eba92f532

3. Make a claim

    Call `addClaim` to ClaimManager contract with identity address, claimType, scheme, signature, data and uri parameters.

    example tx: 0xdb7528e42496542401810e7dcd785db2b4d7e86dea2d59981f5dc8fbb16eb086

4. Payment, transfer ETH between identity

    Call `forwardTo` to MetaIdentityManager contract with sender, identity, destination, value and data parameters.

    example tx: 0xe21ac2544c6eaf4178a3bd2af5c4e62d86589d833acb3c18d6617198c75255ae



Note: Authorization and private key recovery will be update later.

## Reference projects

1. [uport-identity](https://github.com/uport-project/uport-identity) 

2. [origin-playground](https://github.com/OriginProtocol/origin-playground)

3. [ENS](https://github.com/ensdomains/ens)

## Troubleshooting

1. `Error: More than one instance of bitcore-lib found` when running truffle test. 

    Because of package dependency issue. The easiest way is hardcode the package in node modules.
    Edit file in `./node_modules/bitcore-lib/index.js`
    ```
    bitcore.versionGuard = function (version) {return;}
    ```
    Return the function directly.

    reference: https://github.com/bitpay/bitcore/issues/1454