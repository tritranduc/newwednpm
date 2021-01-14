const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

module.exports.check_user = (req,res,next) => {
    if (!req.cookies.userid){
        res.redirect("/auth/login")
        return;
    }
    console.log(req.cookies.userid)
    var user = db.get("user").find({id : req.cookies.userid}).value();
    if (!user){
        res.redirect("/auth/login")
        return;
    }
    res.locals.user = user
    next()
}
