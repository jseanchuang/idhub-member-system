const IdentityManager = artifacts.require('IdentityManager.sol');
const Proxy = artifacts.require('Proxy')
const ClaimManager = artifacts.require('ClaimManager.sol');
const assertThrown = require('./utils/assertThrown')
const Web3 = require('web3');
const web3 = new Web3();

const userTimeLock = 50;
const adminTimeLock = 200;
const adminRate = 50;

contract('ClaimManager', function (accounts) {

  let proxy
  let deployedProxy
  let identityManager
  let claimManager
  let user1
  let nobody
  let recoveryKey


  before(async function () {
    // Truffle deploys contracts with accounts[0]
    user1 = accounts[0]
    user2 = accounts[1]
    nobody = accounts[2]
    recoveryKey = accounts[8]
    recoveryKey2 = accounts[9]
    identityManager = await IdentityManager.new(userTimeLock, adminTimeLock, adminRate)
    deployedProxy = await Proxy.new({
      from: user1
    })
    claimManager = await ClaimManager.new(identityManager.address);
    let tx = await identityManager.createIdentity(user1, recoveryKey, {
      from: user2
    })
    let log = tx.logs[0]
    assert.equal(log.event, 'LogIdentityCreated', 'wrong event')
    proxy = Proxy.at(log.args.identity)
  })

  describe('new claim', async () => {
    var prvSigner;
    var pubSigner;
    var data;
    var claimType;
    var hashed;
    var signed;

    beforeEach(async function () {
      prvSigner = web3.utils.randomHex(32)
      pubSigner = web3.eth.accounts.privateKeyToAccount(prvSigner).address
      data = web3.utils.asciiToHex('Verified OK')
      claimType = 3
      claimScheme = 2
      claimUri = 'abc.com';
      hashed = web3.utils.soliditySha3(user1, claimType, data)
      signed = await web3.eth.accounts.sign(hashed, prvSigner)
    })

    it.skip('forbids claim for non-owners', async () => {
      let threwError = false
      try {
        await claimManager.addClaim(deployedProxy.address, claimType, claimScheme, signed.signature, data, claimUri, {
          from: user2
        });
      } catch (error) {
        assert.match(error.message, /VM Exception while processing transaction: revert/, 'throws an error')
        threwError = true
      }
      assertThrown(threwError, 'Should have thrown an error here')
    });

    it('claim by self', async () => {
      var tx = await claimManager.addClaim(proxy.address, claimType, claimScheme, signed.signature, data, claimUri, {
        from: user1
      });
      let log = tx.logs[0]
      assert.equal(log.event, 'ClaimAdded', 'wrong event')
    });

    describe('claim operation', async () => {
      let claimId;
      let issuer

      beforeEach(async function () {
        issuer = user2;
        var tx = await claimManager.addClaim(proxy.address, claimType, 2, signed.signature, data, claimUri, {
          from: issuer
        });
        claimId = tx.logs[0].args.claimId;
      })

      it('get claim by claim id', async () => {
        var claim = await claimManager.getClaim(proxy.address, claimId)
        assert.equal(claim[0], claimType)
        assert.equal(claim[1], claimScheme)
        assert.equal(claim[2], issuer)
        assert.equal(claim[3], signed.signature)
        assert.equal(claim[4], data)
        assert.equal(claim[5], claimUri)
      });

      it('removes claim by issuer', async () => {
        var tx = await claimManager.removeClaim(proxy.address, claimId, {
          from: issuer
        });
        let log = tx.logs[0]
        assert.equal(log.event, 'ClaimRemoved', 'wrong event')
      });

      it('removes claim by owner', async () => {
        var tx = await claimManager.removeClaim(proxy.address, claimId, {
          from: user1
        });
        let log = tx.logs[0]
        assert.equal(log.event, 'ClaimRemoved', 'wrong event')
      });

      it('forbids removing claim by nobody', async () => {
        let threwError = false
        try {
          await claimManager.removeClaim(proxy.address, claimId, {
            from: nobody
          });
        } catch (error) {
          assert.match(error.message, /VM Exception while processing transaction: revert/, 'throws an error')
          threwError = true
        }
        assertThrown(threwError, 'Should have thrown an error here')
      });
    });

  });

});