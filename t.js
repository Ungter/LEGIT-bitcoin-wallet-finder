const bitcoin = require('bitcoinjs-lib');
const axios = require('axios');
const crypto = require('crypto')
const { ECPairFactory } = require('ecpair');
const ecc = require('tiny-secp256k1');
const fs = require('fs');
const ECPair = ECPairFactory(ecc)

// Generate a random private key
const privGene = crypto.randomBytes(32)

// Convert private key into public key
function genePrivToPub(privKey) {
    const keyPair = ECPair.fromPrivateKey(privKey)
    console.log(privGene.toString('hex'))
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    return address;
}

async function checkAddressUsage(address) {
    try {
        // run your own btc node(~500GB on an nvme) to avoid call limits this one below'll only let you use so much before ip banning you lol
        //const response = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${address}`); 
        const response = await axios.get(``);
        const transactions = response.data.txrefs || [];
        if (transactions.length > 0) {
            console.log(`Address ${address} has been used. Total Transactions: ${transactions.length}`);

            const successString = "Private key: " + privGene.toString('hex') + " Public Key: " + address;

            // Put the address since it'll just overwrite the current one
            fs.writeFileSync(`./Success${address}.txt`, successString, (err) => {
                if (err) throw err; 
            })
        } else {
            console.log(`Address ${address} has not been used.`);
        }
    } catch (error) {
        console.error(`Error checking address: ${error.message}`);
    }
}

const address = genePrivToPub(privGene);

checkAddressUsage(address);