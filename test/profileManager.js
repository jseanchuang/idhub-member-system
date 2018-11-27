const IdentityManager = artifacts.require('IdentityManager.sol');
const Proxy = artifacts.require('Proxy')
const ProfileManager = artifacts.require('ProfileManager.sol');
const assertThrown = require('./utils/assertThrown')
const multihash = require('multihashes');

const userTimeLock = 50;
const adminTimeLock = 200;
const adminRate = 50;

const IPFS = 'QmQa3BDfhvbxTMKfpedqSsYjPRxoeDhv1qE9A33ewpUGqd';

function HashToByte(hash) {
  let buf = multihash.fromB58String(hash);
  return '0x' + multihash.toHexString(buf);
}

function ByteToHash(byte) {
  let hex = byte.substring(2)
  let buf = multihash.fromHexString(hex);
  return multihash.toB58String(buf);
}

contract('ProfileManager', function (accounts) {

  let proxy
  let deployedProxy
  let identityManager
  let profileManager
  let user1
  let nobody
  let recoveryKey

  before(async function () {
    // Truffle deploys contracts with accounts[0]
    user1 = accounts[0]
    nobody = accounts[1] // has no authority
    recoveryKey = accounts[8]
    recoveryKey2 = accounts[9]
    identityManager = await IdentityManager.new(userTimeLock, adminTimeLock, adminRate)
    deployedProxy = await Proxy.new({
      from: user1
    })
    profileManager = await ProfileManager.new(identityManager.address);
  })

  describe('name', async () => {
    let name = 'name1';
    it('forbids setting name by non-owners', async () => {
      let threwError = false
      try {
        await profileManager.setName(deployedProxy.address, name, {
          from: nobody
        })
      } catch (error) {
        assert.match(error.message, /VM Exception while processing transaction: revert/, 'throws an error')
        threwError = true
      }
      assertThrown(threwError, 'Should have thrown an error here')
    });

    it('returns empty when fetching nonexistent name', async () => {
      assert.equal(await profileManager.name(deployedProxy.address), '');
    });

    describe('existing identity', () => {
      beforeEach(async function () {
        let tx = await identityManager.createIdentity(user1, recoveryKey, {
          from: nobody
        })
        let log = tx.logs[0]
        assert.equal(log.event, 'LogIdentityCreated', 'wrong event')
        proxy = Proxy.at(log.args.identity)
      })

      it('permits setting name by owner', async () => {
        await profileManager.setName(proxy.address, name, {
          from: user1
        });
        assert.equal(await profileManager.name(proxy.address), name);
      });

      it('can overwrite previously set names', async () => {
        await profileManager.setName(proxy.address, name, {
          from: user1
        });
        assert.equal(await profileManager.name(proxy.address), name);

        await profileManager.setName(proxy.address, 'new name', {
          from: user1
        });
        assert.equal(await profileManager.name(proxy.address), 'new name');
      });

      it('forbids setting name by non-owners', async () => {
        let threwError = false
        try {
          await profileManager.setName(proxy.address, name, {
            from: nobody
          })
        } catch (error) {
          assert.match(error.message, /VM Exception while processing transaction: revert/, 'throws an error')
          threwError = true
        }
        assertThrown(threwError, 'Should have thrown an error here')
      });
    });
  });

  describe('email', async () => {
    let email = 'email1';

    it('forbids setting email by non-owners', async () => {
      let threwError = false
      try {
        await profileManager.setEmail(deployedProxy.address, email, {
          from: nobody
        })
      } catch (error) {
        assert.match(error.message, /VM Exception while processing transaction: revert/, 'throws an error')
        threwError = true
      }
      assertThrown(threwError, 'Should have thrown an error here')
    });

    it('returns empty when fetching nonexistent email', async () => {
      assert.equal(await profileManager.email(deployedProxy.address), '');
    });

    describe('existing identity', () => {
      beforeEach(async function () {
        let tx = await identityManager.createIdentity(user1, recoveryKey, {
          from: nobody
        })
        let log = tx.logs[0]
        assert.equal(log.event, 'LogIdentityCreated', 'wrong event')
        proxy = Proxy.at(log.args.identity)
      })

      it('permits setting email by owner', async () => {
        await profileManager.setEmail(proxy.address, email, {
          from: user1
        });
        assert.equal(await profileManager.email(proxy.address), email);
      });

      it('can overwrite previously set emails', async () => {
        await profileManager.setEmail(proxy.address, email, {
          from: user1
        });
        assert.equal(await profileManager.email(proxy.address), email);

        await profileManager.setEmail(proxy.address, 'new email', {
          from: user1
        });
        assert.equal(await profileManager.email(proxy.address), 'new email');
      });

      it('forbids setting email by non-owners', async () => {
        let threwError = false
        try {
          await profileManager.setEmail(proxy.address, email, {
            from: nobody
          })
        } catch (error) {
          assert.match(error.message, /VM Exception while processing transaction: revert/, 'throws an error')
          threwError = true
        }
        assertThrown(threwError, 'Should have thrown an error here')
      });
    });
  });

  describe('picture', async () => {
    let picture = IPFS; // IPFS hash

    it('forbids setting picture by non-owners', async () => {
      let threwError = false
      try {
        await profileManager.setPicture(deployedProxy.address, HashToByte(picture), {
          from: nobody
        })
      } catch (error) {
        assert.match(error.message, /VM Exception while processing transaction: revert/, 'throws an error')
        threwError = true
      }
      assertThrown(threwError, 'Should have thrown an error here')
    });

    it('returns empty when fetching nonexistent picture', async () => {
      assert.equal(await profileManager.picture(deployedProxy.address), '0x');
    });

    describe('existing identity', () => {
      beforeEach(async function () {
        let tx = await identityManager.createIdentity(user1, recoveryKey, {
          from: nobody
        })
        let log = tx.logs[0]
        assert.equal(log.event, 'LogIdentityCreated', 'wrong event')
        proxy = Proxy.at(log.args.identity)
      })

      it('permits setting picture by owner', async () => {
        await profileManager.setPicture(proxy.address, HashToByte(picture), {
          from: user1
        });
        let res = await profileManager.picture(proxy.address)
        assert.equal(res, HashToByte(picture));
        assert.equal(ByteToHash(res), picture);
      });

      it('forbids setting picture by non-owners', async () => {
        let threwError = false
        try {
          await profileManager.setPicture(proxy.address, HashToByte(picture), {
            from: nobody
          })
        } catch (error) {
          assert.match(error.message, /VM Exception while processing transaction: revert/, 'throws an error')
          threwError = true
        }
        assertThrown(threwError, 'Should have thrown an error here')
      });
    });
  });

});