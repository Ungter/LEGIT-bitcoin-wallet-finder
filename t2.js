const bitcoin = require('bitcoinjs-lib');
const ecpair = require('ecpair');
const ecc = require('tiny-secp256k1');
const axios = require('axios');

const ECPair = ecpair.ECPairFactory(ecc);

function privateKeyToAddress(privateKeyHex) {
    const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKeyHex, 'hex'));
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    return address;
}

async function checkAddressUsage(address) {
    try {
        const response = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${address}`);
        const transactions = response.data.txrefs || [];
        if (transactions.length > 0) {
            console.log(`Address ${address} has been used. Total Transactions: ${transactions.length}`);
        } else {
            console.log(`Address ${address} has not been used.`);
        }
    } catch (error) {
        console.error(`Error checking address: ${error.message}`);
    }
}

// Replace the following with your private key in hexadecimal format
const privateKeyHex = 'your-private-key-hex';
const address = privateKeyToAddress(privateKeyHex);

console.log(`Generated Bitcoin address: ${address}`);
checkAddressUsage(address);
