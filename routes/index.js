module.exports = function (app) {

    require(__dirname+'/blog')(app)

    app.use(authentication)
    
    require(__dirname+'/admin')(app)

}

function authentication (req, res, next) {
    if (req.method === 'get') {
        return res.sendStatus(404)
    } else if (req.body.pw && req.body.pw === 'yolo') { // check the password
        return next()
    } else {
        return res.sendStatus(403)
    }
}