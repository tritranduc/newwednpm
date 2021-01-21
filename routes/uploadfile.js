var express = require('express');
var router = express.Router();
const shortid = require('shortid');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

var users= db.get('user')
router.get("/",(req,res) => {
    res.render("upload")
})
router.post('/', (req, res, next) => {
        var file = req.file
        console.log(file)
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
        db.get("file").push(file).write()
        res.render("upload",{alerts:"upload file is successful"})
    })
module.exports = router
