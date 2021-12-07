import fetch from 'node-fetch';



//Open Exchange Rate API
// API KEY: d7cafdd25e7d4b7193244ccf6e610329
let open_exchange_rate_api_key = "d7cafdd25e7d4b7193244ccf6e610329"
let open_exchange_rate_api_request = "https://openexchangerates.org/api/latest.json?app_id=" + open_exchange_rate_api_key
//fetch request
fetch(open_exchange_rate_api_request)
    .then((response) => {
        return response.json();
    })
    .then((myJson) => {
        //Alle Rates zu USD 
        console.log(myJson);
        // UST zu EUR 
        console.log(myJson.rates.EUR);
    });