var express = require('express')
var bodyParser = require('body-parser')
var path = require('path');
var expressValidator = require('express-validator')
var mongojs = require('mongojs')
//var db = mongojs('toDo', ['toDo'])
var ObjectId = mongojs.ObjectId
var db = mongojs('mongodb://Cody:USMarshal007@ds044587.mlab.com:44587/lab09', ['toDo'])
var app = express()

app.set('port', (process.env.PORT || 8080))

// View Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Body Parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Set static path
app.use(express.static(path.join(__dirname, 'public')))

// Global Vars
app.use(function(req, res, next) {
    res.locals.errors = null
    next()
})

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}))

// SetUp Routes
app.get('/', function (req, res) {
    db.toDo.find(function (err, docs) {
	    res.render('index', {
        title: 'toDo',
        toDo: docs
        })
    })
})

app.post('/toDo/add', function (req, res) {

    req.checkBody('title', 'title required').notEmpty()
    req.checkBody('description', 'description required').notEmpty()
    req.checkBody('Status', 'status required').notEmpty()
    //req.checkBody('Status', 'status required').notEmpty()

    var errors = req.validationErrors()

    if (errors) {
        db.toDo.find(function (err, docs) {
            res.render('index', {
                title: 'toDo',
                toDo: docs,
                errors: errors
            })
        })
    } else {
        var toDo = {
            title: req.body.title,
            description: req.body.description,
            Status: req.body.Status,

        }
        
        // insert the new tasks into the database
        db.toDo.insert(toDo, function (err, result) {
            if (err) {
                console.log(err)
            }
            res.redirect('/')
        })
    }
})

app.delete('/toDo/delete/:id', function(req, res) {
    db.toDo.remove( { _id: ObjectId(req.params.id) }, function (err, result) {
        if (err) {
            console.log(err)
        }
        res.redirect('/')
    })
})

app.get('/toDo/update/:id', function (req, res) {
    db.toDo.find( { _id: ObjectId(req.params.id) }, function (err, docs) {
	    res.render('update-tasks', {
        toDo: docs[0]
        })
    })
})

app.put('/toDo/update/', function (req, res) {
    var toDo = {
        "_id": ObjectId(req.body.id),
        "title": req.body.title,
        "description": req.body.description,
        "Status": req.body.Status,

    }
    db.toDo.save(toDo, function (err, result) {
        if (err) {
            console.log(err)
        }
        res.redirect('/')
    })
})

app.listen(4000, function () {
    console.log('Server started on port 4000'+ '. . .')
})