const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require('./compile');
const mnemonicPhrase = "<12 word metamask mnemonic>";

const provider = new HDWalletProvider({
    mnemonic: {
        phrase: mnemonicPhrase
    },
    providerOrUrl: "<provider_endpoint_url>"
});

const web3 = new Web3(provider);
const deploy = async () => {
    // get a list of accounts
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy Lottery contract from account : ", accounts[0]);
    //deploy the contract to sepolia
    const lottery = await new web3.eth.Contract(abi)
        .deploy({ data: '0x' + evm.bytecode.object})
        .send({ from: accounts[0],  gas: 5000000});
    console.log("Lottery contract deployed to : ", lottery.options.address);
    // Finish the deployment process elegantly(to avoid hanging deployment)
    provider.engine.stop();
};

deploy();

