import Web3 from 'web3'
import FacuToken from '../build/contracts/FacuToken.json';
import FacuTokenSale from '../build/contracts/FacuTokenSale.json';
const contract = require('@truffle/contract');

export const load = async() => {
    await loadWeb3();
    const account = await loadAccount();
    const { contractFT, contractFTS } = await loadContracts();
    const { ethFunds, transactionCount, tokensSold, ethPriceN, transactions } = await loadVariables(contractFTS);
    const bal = await contractFT.balanceOf(account);
    const myFT = bal / 10**18;
    return { account, contractFTS, contractFT, ethFunds, transactionCount, tokensSold, ethPriceN, transactions, myFT };
};


const loadVariables = async (contractFTS) => {
    const admin = "0xf361eC759e85107Eca4C743e59E624cC4382745d";
    const ethFunds = await window.web3.eth.getBalance(admin);

    const tCount = await contractFTS.transactionCount();
    const transactionCount = tCount.toNumber();

    const tSold = await contractFTS.tokensSold();
    const tokensSold = window.web3.utils.fromWei(tSold, 'ether');

    const ethPrice = await contractFTS.getETHPrice();
    const ethPriceN = ethPrice.toNumber();

    // Make this strange for loop to get the last 10 transactions.
    const transactions = [];
    var j = 0;
    for (var i = transactionCount - 1; i >= 0 && j < 10; i--) {
        const t = await contractFTS.transaction(i);
        j++;
        transactions.push(t);
    }

    return { ethFunds, transactionCount, tokensSold, ethPriceN, transactions };
};

const loadContracts = async () => {
    const FTContract = contract(FacuToken);
    FTContract.setProvider(window.web3.currentProvider);
    const FTSContract = contract(FacuTokenSale);
    FTSContract.setProvider(window.web3.currentProvider);

    const contractFT = await FTContract.deployed();
    const contractFTS = await FTSContract.deployed();

    return { contractFT, contractFTS };
};

const loadAccount = async () => {
    const account = window.web3.eth.getCoinbase();
    return account;
};

const loadWeb3 = async() => {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
};