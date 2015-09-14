var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))

app.set('views',__dirname+'/views')
app.set('view engine','jade')

app.use(require('body-parser').urlencoded({extended:true}))

require(__dirname+'/routes')(app)

app.listen(app.get('port'), function () {
    console.log('running')
})