// Einbinden des readline moduls
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Name in der Konsole ausgeben
console.log("Mayess Sammoud")

//Maximale Bewertung
const maxRate = 5.0
//Anzahl Bewertungen
let numRate = 0
//Bewertung
let rate = 0.0

randomRating(9)
userRating()

// Führt n Random Bewertungen aus
function randomRating(n) {
    for (i = 0; i < n; i++) {
        const randomRate = Math.floor(Math.random() * 5) + 1;
        rate = ((rate * numRate) + randomRate) / (++numRate)
        console.log(
            "\n Ihre Bewertung: " + randomRate
            + "\n Bewertung: " + rate.toFixed(1)
            + "\n Totale Bewertungen: " + numRate
            + "\n")
    }
}

// Führt eine Bewertung von der Konsole aus
function userRating() {
    rl.question('Geben Sie eine Bewertung Zwischen 1 und ' + maxRate + ": ", function (answer) {
        if (isNaN(parseFloat(answer))) {
            console.log(answer + " ist keine Nummer")
        } else if (parseFloat(answer) > 5 || parseFloat(answer) < 1) {
            console.log(answer + " ist nicht zwischen 1 und 5")
        } else {
            rate = ((rate * numRate) + parseFloat(answer)) / (++numRate)
            console.log(
                "\n Ihre Bewertung: " + answer
                + "\n Bewertung: " + rate.toFixed(1)
                + "\n Totale Bewertungen: " + numRate
                + "\n")
        }
        rl.close();
    });
}