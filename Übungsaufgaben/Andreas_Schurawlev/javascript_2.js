// Aufgabe 2

var nameX = "Andreas Schurawlev"
console.log(nameX)


const maxStars = 10
var countRating = 0
var givenRating = 0
var rating = 0
var sumRating = 0


// Aufgabe 2.1

let ratingInfo = ["Stars",countRating,givenRating]

console.log(ratingInfo.length, ratingInfo[ratingInfo.length - 1])


// Aufgabe 2.2, 2.3, 2.4

// rating object has parameter the name, how many ratings, and the lastRating
function ratings(name, countRating, lastRating){
    this.name = name
    this.countRating = countRating
    this.lastRating = lastRating
    this.rating = 0

    // Arrow function
    this.average = () => {
        return this.lastRating/this.countRating
    }
}

var rating1 = new ratings("Google",5,10)

console.log(rating1.name, rating1.countRating, rating1.lastRating, rating1.average());


// Aufgabe 5

const hello = "hello"
const world = "World"
function concatHello(){
    console.log(hello.concat(" ",world))
}

function concatWorld(){
	console.log( world.concat(" ",hello)); // error cause world is defined within function concatHello
    // change const world to a global variable
}

concatHello()
concatWorld()