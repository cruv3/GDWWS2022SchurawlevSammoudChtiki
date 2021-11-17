// Aufgabe 1.1


// Save a Name in a Variable
var nameX = "Andreas Schurawlev"

// print the value x on the console
// info -> console.log is for web console not a shell
console.log(nameX)


// Aufgabe 1.2


// const can not be changed
const maxStars = 10
// maxStars = 4 -> error

// var can be changed and is global
var countRating = 0
var givenRating = 0
var rating = 0
var sumRating = 0

console.log("Maximale Bewertung: " + maxStars + "\n" +
            "Anzahl Bewertungen: " + countRating + "\n" +
            "Aktuelle Bewertung: " + rating)


// veraenderungen

// var can be changed -> JavaScript variables are loosely-typed which means it does not require a data type to be declared
givenRating = "I was an int before and this will work"
console.log(givenRating)

// const cant be changed -> Error: Assignment to constant variable
// maxStars = "This will crash"
// maxStars = 2 -> Will also crashed 




// Aufgabe 1.3

var appName = "Spotify"

// will run the randomRating function first

randomRating(5)

const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

// using promt to repeat the readline if answer is wrong
    
readline.setPrompt('Rate the app ' + appName + ' from 0 to '+ maxStars + '?\n')
readline.prompt()

readline.on('line', (givenStar) => {
        if (parseInt(givenStar) <= maxStars) {
            console.log("You gave the app a " + givenStar)

            calculation(givenStar)

            console.log("Abgegebene Bewertung: " + givenStar + "\n" +
                        "Anzahl Bewertungen: " + countRating + "\n" +
                        "Aktuelle Bewertung: " + rating)

            // close readline
            readline.close()
        } else {
            // repeat the readline because answer is not a number or not 0 to 5
            console.log("Please pick a Number from 0 to " + maxStars + "!")
            readline.prompt()
        }
    })

// Aufgabe 1.4
// right now i put it in a function so i can work with it better

function randomRating(times){

    // counter
    var counter  = 0

    // counter smaller than times -> repeat -> increment counter everytime -> stop loop
    while(counter < times){
        counter++
        var randomRating = Math.floor(Math.random() * maxStars)
        countRating++
        sumRating += randomRating
        rating = sumRating / countRating
        

        console.log("Abgegebene Bewertung: " + randomRating + "\n" +
                    "Anzahl Bewertungen: " + countRating + "\n" +
                    "Aktuelle Bewertung: " + rating)
    }
}


// Aufgabe 1.5


function calculation(newRating){
    countRating++
    sumRating += 1*newRating
    rating = sumRating / countRating
}
