// our server is an http://expressjs.com/ application
var express = require('express')
var app = express()

// tell the app we'll render with jade
app.set('views',__dirname+'/views')
app.set('view engine','jade')

// statically serve all of the files in /public
app.use(require('express').static(__dirname+'/public'))

// provide req.body as JSON, parsed from form input
app.use(require('body-parser').urlencoded({extended:true}))

// set up the routes exposed by the server
require(__dirname+'/routes')(app)

// run the server on port 5000
app.listen(5000)