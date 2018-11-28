---
title: "ClaimManager Contract"
category: "reference"
type: "content"
---

# ClaimManager
The ClaimManager contract acts as a permanent recorder for [identifier](./proxy.md). Identity can record claim on it. 

## Requirements
The ClaimManager should be able to preform the following actions:

* Make claim
  - Make claim by self
  - Make claim by third-party authority
* Revoke claim
  - Revoke a claim by issuer
* Browse claim
  - Open claim for everyone
  - Query claim by identity address and cliamid

## Design
The design idea like [profilemanager](./ProfileManager.md), can query cliams by identity address and `claimid`. Isolate the claim contract for scalability and further support. The implementation is reference [ERC735](https://github.com/ethereum/EIPs/issues/735).


## Description of functions

### Constructor `ClaimManager`
The constructor function initializes the `managerAddr`, IdentityManager addess. In order to verify existence and operation permission of identity.

### `addClaim`
Make a claim for specific identity by issuer. The basic struct includes 
`claimType`, `scheme`, `issuer`, `signature`, `data` and `uri`.

### `cancelClaim`
Revoke a claim by issuer. Besides, identity owner has permission to revoke claim.


### `getClaim`
Get claim by `identity` address and `claimid`
