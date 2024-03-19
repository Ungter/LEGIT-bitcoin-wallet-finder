const axios = require('axios');


const rpcURL = ''; // Replace with your RPC URL and port
const rpcUser = ''; // Replace with your RPC username
const rpcPassword = ''; // Replace with your RPC password


    const config = {
        method: 'post',
        url: rpcURL,
        headers: {
            'Content-Type' : "text/plain",
        },
        data: {
            jsonrpc: "1.0",
            id: "curltest",
            method: "scantxoutset",
            params: ["start", [{ "desc": "addr()"}]]
        },
        auth: {
            username: rpcUser,
            password: rpcPassword
        }
    }


async function getAns() {
    axios(config).then(function (response) {
        console.log(response.data.result.total_amount);
    })
    .catch(function (error) {
        console.log(error)
    });
}

getAns()

