const IdentityManager = artifacts.require('IdentityManager.sol');
const Proxy = artifacts.require('Proxy')
const ProfileManager = artifacts.require('ProfileManager.sol');
const assertThrown = require('./utils/assertThrown')

const userTimeLock = 50;
const adminTimeLock = 200;
const adminRate = 50;

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


    it('forbids setting name by non-owners', async () => {
      let threwError = false
      try {
        await profileManager.setName(deployedProxy.address, 'name1', {
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
        await profileManager.setName(proxy.address, 'name1', {
          from: user1
        });
        assert.equal(await profileManager.name(proxy.address), 'name1');
      });

      it('can overwrite previously set names', async () => {
        await profileManager.setName(proxy.address, 'name1', {
          from: user1
        });
        assert.equal(await profileManager.name(proxy.address), 'name1');

        await profileManager.setName(proxy.address, 'name2', {
          from: user1
        });
        assert.equal(await profileManager.name(proxy.address), 'name2');
      });

      it('forbids setting name by non-owners', async () => {
        let threwError = false
        try {
          await profileManager.setName(proxy.address, 'name1', {
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