var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = ""; //Dentro das aspas, insira as 12 palavras de sua carteira

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    rbb: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "") //Dentro das aspas, insira o url do nó da sua rede
      },
      network_id: 0, //Substitua o 0 pelo id da sua rede
      gas: 0,
      gasPrice: 0,
    }
  },
  compilers: {
    solc: {
      version: "^0.7.0"
  }
}
};