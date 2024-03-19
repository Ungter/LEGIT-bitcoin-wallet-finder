const ethers = require('ethers');
const axios = require('axios');

const provider = new ethers.JsonRpcProvider('https://mainnet.era.zksync.io');

const tokenContractAddress = '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4';
const abi = ['function balanceOf(address owner) public view returns (uint256)'];
const contract = new ethers.Contract(tokenContractAddress, abi, provider);

const walletAddress = '0x1181D7BE04D80A8aE096641Ee1A87f7D557c6aeb';
const abiString1 = '{"inputs":[{"internalType":"uint256","name":"redeemAmount","type":"uint256"}],"name":"redeemUnderlying","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}';
const abi1 = JSON.parse(abiString1);                                                                                                                                                                                                                                                                                                                                          


const abiString2 = '{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}';
const abi2 = JSON.parse(abiString2);

const combinedAbi = [abi1, abi2];
let lastBalance = BigInt('0');
const unwrapperContract = new ethers.Contract(walletAddress, combinedAbi, provider)

const walletPrivateKey = 'e9ff4d5958d899d580b1d9b2fefdfcd7549f3a417f3e41610ffaecbcc8213476';
const walletAddr = '0x615EfDe97df2CF7e46525352baCDb274c25B996b';
const wallet = new ethers.Wallet(walletPrivateKey, provider);

const contractWithSigner = unwrapperContract.connect(wallet);
let checkBalanceInterval;

async function checkBalance() {
    console.log('Checking balance...')
    const balance = await contract.balanceOf(walletAddress);
    const tokensLeftToUnwrap = await unwrapperContract.balanceOf(walletAddr);
    console.log('Left to unwrap: ' + (ethers.formatEther(tokensLeftToUnwrap) * 10000000000))
    console.log('current contract balance:' + (ethers.formatEther(balance) * 10000000000))
    
    if (balance > lastBalance && tokensLeftToUnwrap > 0) {
        const increase = balance - lastBalance;
        console.log('Balance increased! New balance: ' + (ethers.formatEther(balance) * 10000000000));
        notifyTelegram('Balance increased! New balance: ' + (ethers.formatEther(balance) * 10000000000));

        if (increase <= tokensLeftToUnwrap) {
            const tx = await contractWithSigner.redeemUnderlying(increase);
            console.log('Unwrap transaction sent, tx hash:', tx.hash);
            notifyTelegram('Unwrap transaction sent, tx hash: ' + tx.hash);
            notifyTelegram('Unwrapped amount: ' + (ethers.formatEther(increase) * 10000000000) + ' USDC');
            notifyTelegram('Left to unwrap:' + (ethers.formatEther(tokensLeftToUnwrap) * 10000000000));
        } else {
            const tx = await contractWithSigner.redeemUnderlying(tokensLeftToUnwrap);
            console.log('Unwrap transaction sent, tx hash:', tx.hash);
            notifyTelegram('Unwrap transaction sent, tx hash: ' + tx.hash);
            notifyTelegram('Unwrapped amount: ' + (ethers.formatEther(tokensLeftToUnwrap) * 10000000000) + ' USDC');
            notifyTelegram('Left to unwrap:' + (ethers.formatEther(tokensLeftToUnwrap) * 10000000000));
        }
        
        lastBalance = balance;
    } else if (tokensLeftToUnwrap == 0) {
        clearInterval(checkBalanceInterval);
        notifyTelegram('All tokens unwrapped!');
    }
}

async function notifyTelegram(message) {
    const url = `https://api.telegram.org//sendMessage?chat_id=&text=${encodeURIComponent(message)}`;
    try {
        await axios.get(url);
    } catch (error) {
        console.error('Error sending Telegram message:', error);
    }
}

notifyTelegram('Starting unwrap checker...');
checkBalance();
checkBalanceInterval = setInterval(checkBalance, 10000);
