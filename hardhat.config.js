require('@nomicfoundation/hardhat-toolbox');
require('@openzeppelin/hardhat-upgrades');
// require('@nomiclabs/hardhat-etherscan');
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  networks: {
    sepolia: {
      url: process.env.REACT_APP_SEPOLIA_URL,
      accounts: [process.env.REACT_APP_SEPOLIA_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.REACT_APP_ETHERSCAN_KEY,
  }
};
