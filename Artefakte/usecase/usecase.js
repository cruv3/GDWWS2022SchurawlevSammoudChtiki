const fetch = require("node-fetch");

const api = "https://wg-ton.herokuapp.com/api/";

async function start() {
  // creating new Member
  const responseMember = await fetch(api + "/wg/BesteWG/mb", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: {
      mb_name: "Sergej",
    },
  });

  responseMember.json().then((data) => console.log(data));
  console.log("");

  // add the shoppinglist

  const responseADD = await fetch(api + "/wg/BesteWG/mb/Max/sd", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: [
      {
        sd_name: "Bacon",
        bezahler: "Max",
        profitierer: ["Sergej", "Steffi"],
      },
      {
        sd_name: "Coffee",
        bezahler: "Max",
        profitierer: ["Sergej", "Steffi"],
      },
      {
        sd_name: "Milk",
        bezahler: "Max",
        profitierer: ["Steffi"],
      },
      {
        sd_name: "Nutella",
        bezahler: "Max",
        profitierer: ["Sergej"],
      },
    ],
  });

  responseADD.json().then((data) => console.log(data));
  console.log("");
  // check the bill
  const responseBill = await fetch(api + "/wg/BesteWG/mb/sd");
  responseBill.json().then((data) => console.log(data));
  console.log("");
}

start()