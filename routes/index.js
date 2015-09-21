module.exports = function (app) {

    // expose the read-only routes
    require(__dirname+'/blog')(app)

    // weak authentication / security
    app.use(authentication)
    
    // the 'logged in' portion of the app/site
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