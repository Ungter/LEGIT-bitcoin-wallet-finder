const axios = require('axios');


const rpcURL = 'http://jungt:5719166Captn!@localhost:8332'; // Replace with your RPC URL and port
const rpcUser = 'jungt'; // Replace with your RPC username
const rpcPassword = '5719166Captn'; // Replace with your RPC password


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
            params: ["start", [{ "desc": "addr(bc1qkaesdk5xjmdcy2g0v3uj9dyp8j5emqfac3vlzy)"}]]
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

