// connect to mysql database
var sql = require('mysql').createPool({ host: 'localhost', user: 'root', password: 'sql', database: 'blog'})
module.exports = function (app) {
    
    // our blog http://localhost:5000/ has 2 categories
    // /work, /play 
    app.get('/:category', function (req, res) {
        var category = req.params.category;
        if (category === 'work' || category === 'play') {
            sql.query('SELECT * FROM Article WHERE category=?;', [category], function (err, articles) {
                if (err) throw err
                return res.render('category', {articles:articles,category:category})
            })
        } else {
            return res.sendStatus(404)
        }
    })

    // /work/1, /play/4
    app.get('/:category/:article', function (req, res) {
        var category = req.params.category;
        if (category === 'work' || category === 'play') {
            var articleid = req.params.article
            sql.query('SELECT * FROM Article WHERE id=?', [articleid], function (err, articles) {
                if (err) throw err
                sql.query('SELECT * FROM Comment WHERE articleid=?', [articleid], function (err, comments) {
                    if (err) throw err
                    return res.render('article', {article:articles[0],comments:comments})
                })
            })
        } else {
            return res.sendStatus(404)
        }
    })

}