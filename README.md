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
  * [x] [內容大意](./docs/OriginTrail.1.md)
  * [x] [讀後心得](./docs/OriginTrail.2.md)


## 會員身份 Smart Contract

### Ropsten testnet (id: 3)
|Contract|Address|
| --|--|
|[IdentityManager](./contracts/IdentityManager.sol)|[0x27500ae27b6b6ad7de7d64b1def90f3e6e7ced47](https://ropsten.etherscan.io/address/0x27500ae27b6b6ad7de7d64b1def90f3e6e7ced47)|
|[TxRelay](./contracts/TxRelay.sol)|[0xa5e04cf2942868f5a66b9f7db790b8ab662039d5](https://ropsten.etherscan.io/address/0xa5e04cf2942868f5a66b9f7db790b8ab662039d5)|
|[MetaIdentityManager](./contracts/MetaIdentityManager.sol)|[0xbdaf396ce9b9b9c42cd40d37e01b5dbd535cc960](https://ropsten.etherscan.io/address/0xbdaf396ce9b9b9c42cd40d37e01b5dbd535cc960)|
|[ProfileManager](./contracts/ProfileManager.sol)|[0xbdaf396ce9b9b9c42cd40d37e01b5dbd535cc960](https://ropsten.etherscan.io/address/0xbdaf396ce9b9b9c42cd40d37e01b5dbd535cc960)|
|[ClaimManager](./contracts/ClaimManager.sol)|[0xbdaf396ce9b9b9c42cd40d37e01b5dbd535cc960](https://ropsten.etherscan.io/address/0xbdaf396ce9b9b9c42cd40d37e01b5dbd535cc960)|

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
```

### Reference projects

1. [uport-identity](https://github.com/uport-project/uport-identity) 

2. [origin-playground](https://github.com/OriginProtocol/origin-playground)

3. [ENS](https://github.com/ensdomains/ens)
