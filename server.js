var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Todo = require('./app/models/todo');
var port = process.env.PORT || 8080;        // set our port
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.connect('mongodb://user:user@ds221258.mlab.com:21258/todos');

mongoose.connection.on('error', function(){
    console.log('could not connect to db');
    process.exit();
});
mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// middleware to use for all requests
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/todos')
    .get(function(req, res) {
        Todo.find(function(err, todos) {
            if (err)
                res.status(500).send(err);

            res.json(todos);
        });
    }) 

    .post(function(req, res){
        var todo = new Todo();
        todo.name = req.body.name;
        todo.complete = req.body.complete;

        todo.save(function(err){
            if(err) 
                res.status(500).send(err);
            Todo.find(function(err, todos){
                if(err)
                    res.status(500).send(err);
                res.json(todos);
            })
        });
    });

router.route('/todos/:id')
    .put(function(req, res){
        Todo.findById(req.params.id, function(err, todo){
            if(err) 
                res.status(500).send(err);
            todo.complete = req.body.complete;

            todo.save(function(err){
                if(err) 
                    res.send(err);
                Todo.find(function(err, todos){
                    if(err)
                        res.status(500).send(err);
                    res.json(todos);
                })
            });
        });
    })

    .delete(function(req, res){
        Todo.remove({
            _id: req.params.id
        }, function(err, todo){
            if(err)
                res.status(500).send(err);
            Todo.find(function(err, todos){
                if(err)
                    res.status(500).send(err);
                res.json(todos);
            })
        })
    })

app.use('/api', router);

app.listen(port, function(){
    console.log('available on: ' + port);
});