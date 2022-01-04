const express = require('express');
const fs = require('fs')
const bodyParser = require("body-parser")
const router = express.Router();

const mainUri = 'localhost:3000'

const jsonHelper = require("../help/userHelper");
const jsonFileWG = "../mainApi/db/wg.json"

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))



// return all mitbewohner inside wg
router.get('/:wgID', (req,res)=>{
    jsonHelper.getUser(jsonFileWG, req.params.wgID)
        .then((ans)=> res.status(200).json(ans))
        .catch(() => res.status(400).json({error : "couldnt find wg"}))
})

// return mitbewohners schulden
router.get('/:wgID/:mbID/schulden', (req, res) =>{
    jsonHelper.getSchulden(jsonFileWG, req.params.wgID, req.params.mbID)
        .then((ans) => res.status(200).json(ans))
        .catch(() => res.status(400).json({error : "could not find"}))
})

// add to json inside mitbewohner, a mitbewohner
router.post('/:wgID',(req,res)=>{
    if(req.body == "{}" || req.body.name == undefined){
        res.status(400).json({
            message: "Body is empty",
            name : req.body.name,
        })
    }else{
        const newMitbewohner = {
            name : req.body.name,
            schulden : req.body.schulde || []
        }

        jsonHelper.addUser(jsonFileWG, req.params.wgID,newMitbewohner)
            .then((ans) => res.status(201).json({
                status : "added",
                ans
            }))
            .catch(() => res.status(400).json({error : "couldnt find wg"}))
    }
})

// add schulden to mitbewohner
router.post('/:wgID/:mbID/schulden',(req,res) =>{
    if(req.body == "{}"){
        res.status(400).json({
            message: "Body is empty",
            name : req.body.name,
        })
    }else{
        jsonHelper.addSchulden(jsonFileWG, req.params.wgID,req.params.mbID,req.body)
    }
})

// change in mitbewohner, the mitbewohner
router.put('/:wgID/:mbID',(req, res)=>{
    if(req.body == "{}" || req.body.name == undefined){
        res.status(400).json({
            message: "Body is empty",
            name : req.body.name,
        })
    }else{

        const change = {
            name : req.body.name || undefined,
            schulden : req.body.schulden || []
        }
        jsonHelper.changeUser(jsonFileWG, req.params.wgID, req.params.mbID, change)
            .then((ans)=> res.status(201).json({
                status : "changed",
                ans
            }))
            .catch(() => res.status(400).json({error : "could not find"}))
    }
})

// change schulden

// delete user
router.delete('/:wgID/:mbID', (req,res) =>{
    if(req.body == "{}" || req.body.name == undefined){
        res.status(400).json({
            message: "Body is empty",
            name : req.body.name,
        })
    }else{
        jsonHelper.deleteUser(jsonFileWG,req.params.wgID,req.params.mbID)
            .then((ans) => res.status(200).json({
                status : "deleted",
                ans
            }))
            .catch(() => res.status(400).json({error : "could not find"}))
    }

})

// delete schulden


module.exports = [
    router
]