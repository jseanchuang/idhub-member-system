const IdentityManager = artifacts.require('./IdentityManager.sol')
const ProfileManager = artifacts.require('./ProfileManager.sol')
const TxRelay = artifacts.require('./TxRelay.sol')
const MetaIdentityManager = artifacts.require('./MetaIdentityManager.sol')
const ClaimManager = artifacts.require('./ClaimManager.sol')

const USER_TIME_LOCK = 3600
const ADMIN_TIME_LOCK = 129600
const ADMIN_RATE = 1200

module.exports = function (deployer) {
  deployer.deploy(IdentityManager, USER_TIME_LOCK, ADMIN_TIME_LOCK, ADMIN_RATE).then(() => {
    return deployer.deploy(TxRelay)
  }).then(() => {
    return deployer.deploy(MetaIdentityManager, USER_TIME_LOCK, ADMIN_TIME_LOCK, ADMIN_RATE, TxRelay.address)
  }).then(() => {
    deployer.deploy(ProfileManager, MetaIdentityManager.address);
  }).then(() => {
    deployer.deploy(ClaimManager, MetaIdentityManager.address);
  })
}