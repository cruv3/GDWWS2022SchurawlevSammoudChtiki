const hello = "hello"

function concat1() {
    const world = "World"
    console.log(hello + " " + world)
}
function concat2() {
    //  console.log(world +" "+ hello) // world ist in dieser funktion nicht definiert
    console.log("world" + " " + hello)
}

concat1()
concat2()
// Einbinden des readline moduls
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


//Maximale Bewertung
const maxRate = 5.0
//Anzahl Bewertungen
let numRate = 0
//Bewertung
let rate = 0.0
//Bewertungen Array
let array = []
let n = 0
randomRating(9)

console.log(
    "\n laenge des Arrays: " + array.length
    + "\n zuletzt eingetragene Bewertung: " + array[array.length - 1].zulestEingetragen
    + "\n Bewertung Durchschnitt: " + array[array.length - 1].druchschnitt
    + "\n")


// Führt n Random Bewertungen aus
function randomRating(x) {
    for (i = 0; i < x; i++) {
        let randomRate = (Math.floor(Math.random() * 5) + 1).toFixed(1);
        //  rate = ((rate * numRate) + randomRate) / (++numRate)
        let name = "Bewertung " + i
        function Bewertung(name, rate, numRate, randomRate) {
            this.name = name
            this.anzahlBewertungen = numRate
            this.zulestEingetragen = randomRate
            this.durschnittVorEintragen = rate
            this.druchschnitt = () => {
                return ((this.durschnittVorEintragen * this.anzahlBewertungen) + this.zulestEingetragen) / (++this.anzahlBewertungen);
            }
        }
        var newBewertung = new Bewertung(name, rate, numRate, randomRate)
        array.push(newBewertung)
    }
}


