var express = require('express')
var app = express()

app.set('views',__dirname+'/views')
app.set('view engine','jade')

app.use(require('express').static(__dirname+'/public'))

app.use(require('body-parser').urlencoded({extended:true}))

require(__dirname+'/routes')(app)

app.listen(5000, function () {
    console.log('blog running at http://localhost:5000')
})