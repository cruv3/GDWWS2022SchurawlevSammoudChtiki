// Aufgabe 1.1

// Save a Name in a Variable
var nameX = "Andreas Schurawlev"

// print the value x on the console
// info -> console.log is for web console not a shell
console.log(nameX)

// Aufgabe 1.2

// const can not be changed
const maxStars = 5
// maxStars = 4 -> error

// var can be changed and is global
var currentStar = 0
var newStar = 0
var starname = 'Star'

console.log(maxStars)
console.log(currentStar)
console.log(newStar)

// change the var and print it
// this means one rating was made
newStar = 3
// newstar = "5 Sterne" -> console.log returned string
currentStar =  newStar

// we need var for increasing a rating number

var ratingCounter = 0
ratingCounter = ratingCounter + 1

console.log(maxStars)
console.log(currentStar)
console.log(newStar)


// init a array
let array = ["Stars",ratingCounter,newStar]


// Aufgabe 1.3

// put everthing in a function to do every Aufgabe separated

function userInput(){
    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
      });
    
    // using promt to repeat the readline if answer is wrong
    
    readline.setPrompt("Rate the programm from 0 to 5?\n")
    readline.prompt()

    readline.on('line', function(input) {
        if(parseInt(input) <= maxStars ){
            console.log("The programm right now has " + currentStar + " Stars")
            console.log("You gave the programm " + input + " Stars");

            newStar = input
            currentStar = newStar
            ratingCounter = ratingCounter + 1
    
          // close readline
          readline.close()
        }else{
    
            // repeat the readline because answer is not a number
            console.log("Please pick a Number from 0 to 5!")
            readline.prompt()
        }
    })
}

// Aufgabe 1.4

function randomRating(){

    // get random number from 0 to 10 (max)
    var randomRepeater = Math.floor(Math.random() * 10)
    var repeater  = 0

    while(repeater < randomRepeater){

        var randomRating = Math.floor(Math.random() * maxStars)
        // counter + 1 because we already have one rating
        console.log("Ratings: " + (ratingCounter + 1))
        console.log("CurrentStar: " + currentStar)
        console.log("NewStar: " + randomRating)

        newStar = randomRating
        ratingCounter = ratingCounter + 1

        // Push inside array
        array.push("Stars")
        array.push(ratingCounter)
        array.push(newStar)

        repeater ++
    }
}

randomRating()

// Aufgabe 2.1
console.log("Aufgabe 2")

console.log(array.length)
array.forEach(function(name, index, array) {
    console.log(name, index)
});

// Aufgabe 2.2

let ratings = {
    name : starname,
    counter : ratingCounter,
    lastRating : newStar
} 
console.log(ratings)


console.log(ratings.starname)

// how to change the name?
ratings.starname = "name2"

// inside the randomRating function, we could do an if-statement -> 
// if rating == 1 starname = star1
