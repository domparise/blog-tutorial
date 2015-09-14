var sql = require('mysql').createPool({ host: 'localhost', user: 'root', password: 'sql', database: 'blog'})
module.exports = function (app) {

    app.post('/admin', function (req, res) {
        sql.query('SELECT title,category,id FROM Article', function (err, articles) {
            return res.render('admin', {categories: makeCategories(articles),pw:req.body.pw})
        })
    })

    app.post('/admin/new', function (req,res) {
        return res.render('article-new',{pw:req.body.pw})
    })

    app.post('/admin/edit', function (req,res) {
        return renderArticleAndComments('article-edit', req.body.id, req, res)
    })

    app.post('/admin/article/new', function (req, res) {
        sql.query('INSERT INTO Article (title,category,content) VALUES (?,?,?)', [req.body.title,req.body.category,req.body.content], function (err, result) {
            if (err) throw err
            return renderArticleAndComments('article', result.insertId, req, res)
        })
    })

    app.post('/admin/article/edit', function (req, res) {
        sql.query('UPDATE Article SET title=?, category=?, content=? WHERE id=?', [req.body.title,req.body.category,req.body.content,req.body.id], function (err) {
            if (err) throw err
            return renderArticleAndComments('article', req.body.id, req, res)
        })
    })

    app.post('/admin/article/remove', function (req, res) {
        sql.query('DELETE FROM Article WHERE id=?',[req.body.id], function (err) {
            if (err) throw err
            sql.query('SELECT title,category,id FROM Article', function (err, articles) {
                if (err) throw err
                return res.render('admin', {categories:makeCategories(articles),pw:req.body.pw})
            })
        })
    })

    app.post('/admin/article/remove-comment', function (req, res) {
        sql.query('DELETE FROM Comment WHERE id=?', [req.body.id], function (err) {
            if (err) throw err
            req.body.id = req.body.articleid
            return renderArticleAndComments('article', req.body.articleid, req, res)
        })
    })

}

function renderArticleAndComments (view, articleid, req, res) {
    sql.query('SELECT * FROM Article WHERE id=?',[articleid], function (err, articles) {
        if (err) throw err
        sql.query('SELECT * FROM Comment WHERE articleid=?', [articleid], function (err, comments) {
            if (err) throw err
            return res.render(view, {article:articles[0], comments:comments, pw:req.body.pw})
        })
    })
}


/* 
    takes array of articles as input and returns articles grouped by category
*/ 
function makeCategories (articles) {
    var categories = {};
    categories = articles.reduce(function (categories, article) {
        if (!categories[article.category]) categories[article.category] = [];
        categories[article.category].push(article);
        return categories;
    }, categories);
    return categories;
}