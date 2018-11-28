const HDWalletProvider = require("truffle-hdwallet-provider");
const TestRPC = require("ganache-cli");
const PrivateKeyProvider = require("truffle-privatekey-provider");
var privateKey = "5A8F7179A8B4B9076406DD5E473BA968D59B1DF2DDF82E54C8075B800FF5173D";

let provider

function getNmemonic() {
  try {
    return require('fs').readFileSync("./seed", "utf8").trim();
  } catch (err) {
    return "";
  }
}

function getProvider(rpcUrl) {
  if (!provider) {
    provider = new HDWalletProvider(getNmemonic(), rpcUrl)
  }
  return provider
}


module.exports = {
  networks: {
    in_memory: {
      get provider() {
        if (!provider) {
          provider = TestRPC.provider({
            total_accounts: 25
          })
        }
        return provider
      },
      network_id: "*"
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555, // <-- Use port 8555
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01 // <-- Use this low gas price
    },
    privateTest: {
      host: "localhost",
      port: 8544,
      network_id: "234"
    },
    local: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new PrivateKeyProvider(privateKey, "https://ropsten.infura.io/"),
      gas: 4004580,
      network_id: 3
    },
    rinkeby: {
      provider: new PrivateKeyProvider(privateKey, "https://rinkeby.infura.io/"),
      network_id: 4
    },
    infuranet: {
      provider: new PrivateKeyProvider(privateKey, "https://infuranet.infura.io/"),
      network_id: "*"
    },
    kovan: {
      provider: new PrivateKeyProvider(privateKey, "https://kovan.infura.io/"),
      gas: 4004580,
      network_id: 42
    },
    mainnet: {
      provider: new PrivateKeyProvider(privateKey, "https://mainnet.infura.io/"),
      gas: 1704580,
      gasPrice: 1000000000,
      network_id: 1
    }
  }
};