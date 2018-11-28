---
title: "ProfileManager Contract"
category: "reference"
type: "content"
---

# ProfileManager
The ProfileManager contract acts as a permanent recorder for [identifier](./proxy.md). Identity can record basic infomation on it. 

## Requirements
The ProfileManager should be able to preform the following actions:

* Profile setting
    - Set basic information about the identity.
    - Only identitly owner has ability to edit
* Profile browser
  - Open profile for everyone
  - Query profile by identity address

## Design
The basic idea like an open phonebook, can query information by identity address. Isolate the profile contract for scalability and further support. The implementation is reference [ENS resolver](https://github.com/ensdomains/ens/blob/master/contracts/PublicResolver.sol).

## Description of functions

### Constructor `ProfileManager`
The constructor function initializes the `managerAddr`, IdentityManager addess. In order to verify existence and operation permission of identity.

### `setName`
Edit name of identity.

### `name`
Return name of identity.

### `setEmail`
Edit email of identity.

### `email`
Return email of identity.

### `setPicture`
Edit picture of identity. Record encoded IPFS hash in hex format.

### `picture`
Return picture of identity in byte. Decode hex to get IPFS hash.

## Implementation of IPFS transformation

* Transfer from IPFS(Base58) to hex format:
```
import multihash from 'multihashes'

export const toHex = function(ipfsHash) {
  let buf = multihash.fromB58String(ipfsHash);
  return '0x' + multihash.toHexString(buf);
}
```

* transfer from hex format to IPFS(Base58):
```
import multihash from 'multihashes'

export const toBase58 = function(contentHash) {
  let hex = contentHash.substring(2)
  let buf = multihash.fromHexString(hex);
  return multihash.toB58String(buf);
}
```