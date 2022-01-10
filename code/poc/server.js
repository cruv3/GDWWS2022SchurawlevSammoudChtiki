const fs = require("fs")
const fetch = require("node-fetch");

getProduct("butter")

async function getProduct(name){
//Open Exchange Rate API
// API KEY: d7cafdd25e7d4b7193244ccf6e610329
let open_exchange_rate_api_key = "d7cafdd25e7d4b7193244ccf6e610329"
let open_exchange_rate_api_request = "https://openexchangerates.org/api/latest.json?app_id=" + open_exchange_rate_api_key
//fetch request
fetch(open_exchange_rate_api_request)
    .then((response) => {
        return response.json();
    })
    .then((ratesJson) => {
        //Alle Rates zu USD
        console.log(ratesJson);
        // USD zu EUR
        console.log("USD EUR Rate: " + ratesJson.rates.EUR);
        return ratesJson.rates.EUR
    }).then((rate)=>{
        
        fs.readFile("poc/prices.json", (err, data) => {
            if (err) throw (err)
            obj = JSON.parse(data)
            let result = []
            obj.forEach(element => {
                if (element.product.toUpperCase().includes(name.toUpperCase())){
                    console.log(element)
                    var price = element.price.substring(1)
                    var newPrice = (parseFloat(price) * rate).toFixed(2)
                    element.price= "€" + newPrice
                    result.push(element)
                    console.log(element)
                }
            })
        })
    }).catch((err)=>{
        console.log(err)
    })
}
