var sql = require('mysql').createPool({ host: 'localhost', user: 'root', password: 'sql', database: 'blog'})
module.exports = function (app) {

    app.get('/', function (req, res) {
        res.sendFile(__dirname+'/public/index.html')
    })

    app.get('/blog/:category', function (req, res) {
        var category = req.params.category;
        if (category === 'work' || category === 'play') {
            sql.query('SELECT * FROM Article WHERE category=?;', [category], function (err, articles) {
                if (err) throw err
                res.render('category', {articles:articles,category:category})
            })
        } else {
            res.send(400)
        }
    })

    function getArticleAndComments (articleid, cb) {
        sql.query('SELECT * FROM Article WHERE id=?',[articleid], function (err, articles) {
            if (err) throw err
            sql.query('SELECT * FROM Comment WHERE articleid=?', [articleid], function (err, comments) {
                if (err) throw err
                cb({article:articles[0],comments:comments})
            })
        })
    }

    app.get('/blog/:category/:article', function (req, res) {
        var category = req.params.category;
        if (category === 'work' || category === 'play') {
            getArticleAndComments(req.params.article, function (articleAndComments) {
                res.render('article', articleAndComments)
            })
        } else {
            res.send(400)
        }
    })

    // checks password
    app.use(function (req, res, next) {
        if (req.body.pw && req.body.pw === 'yolo') {
            next()
        } else {
            res.send(403)
        }
    })

    app.post('/admin', function (req, res) {
        sql.query('SELECT title,category,id FROM Article', function (err, articles) {
            res.render('admin', {articles:articles})
        })
    })

    app.post('/admin/new', function (req,res) {
        res.render('article-new')
    })

    app.post('/admin/edit', function (req,res) {
        getArticleAndComments(req.body.id, function (articleAndComments) {
            res.render('article-edit', articleAndComments)
        })
    })

    app.post('/admin/new', function (req, res) {
        sql.query('INSERT INTO Article (title,category,content) VALUES (?,?,?)', [req.body.title,req.body.category,req.body.content], function (err, result) {
            if (err) throw err
            getArticleAndComments(result.insertId, function (articleAndComments) {
                res.render('article', articleAndComments)
            })
        })
    })

    app.post('/admin/edit', function (req, res) {
        sql.query('UPDATE Article SET title=?, category=?, content=? WHERE id=?', [req.body.title,req.body.category,req.body.content,req.body.id], function (err) {
            if (err) throw err
            getArticleAndComments(req.body.id, function (articleAndComments) {
                res.render('article', articleAndComments)
            })
        })
    })

    app.post('/admin/remove', function (req, res) {
        sql.query('DELETE FROM Article WHERE id=?',[req.body.id], function (err) {
            if (err) throw err
            sql.query('SELECT title,category,id FROM Article', function (err, articles) {
                if (err) throw err
                res.render('admin', {articles:articles})
            })
        })
    })

    app.post('/admin/remove-comment', function (req, res) {
        sql.query('DELETE FROM Comment WHERE id=?', [req.body.id], function (err) {
            if (err) throw err
            getArticleAndComments(req.body.articleid, function (articleAndComments) {
                res.render('article', articleAndComments)
            })
        })
    })

}