const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router();

const mainUri = 'localhost:3000'

const jsonHelper = require("../help/JsonHelper")

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))


// WG ausgeben
router.get('/',(req,res,next)=>{
    wgList = jsonHelper.returnWG()
    console.log(wgList)
    res.status(200).json({
        JSON: "xD"
    })
})

// WG anlegen
router.post('/', (req, res, next)=>{
    if(req.body.name == undefined){
        req.statusCode(400).json({
            message: "Body in POST is empty",
            missing: "name"
        })
        return
    }

    // function that checks wgname existence 
    if(jsonHelper.checkIfWGExist(req.body.name)){
        res.status(409).json({
            WG_Name: "A WG with this name already exist"
        })
        return
    }

    // creates wg
    const newWG = {
        uri: mainUri + '/wg/' + req.body.name,
        name : req.body.name,
        mitbewohner: []
    }

    jsonHelper.addToJson(newWG)

    res.status(201).json({
        WG_created: newWG
    })
})


module.exports = [
    router
]