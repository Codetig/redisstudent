var express = require('express'),
app = express(),
redis = require('redis'),
client = redis.createClient(),
bodyParser = require('body-parser'),
methodOverride = require('method-override');

//middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
//for css/js/imgs
app.use(express.static(__dirname + '/public'));

//routes
app.get('/', function(req, res){
  client.smembers("studentset", function(err, rep){
    res.render('index', {students: rep});  
  });
  
});

app.get('/edit/:stud', function(req, res){ //edit
  res.render('edit', {name: req.params.stud});
});

app.put('/update/:stud', function(req, res){
   // client.srem("studentset", req.params.stud, function(err, rep){
   //  console.log("deleted a student");
   //  client.sadd("studentset", req.body.nom, function() {
   //      // body...
   //      console.log("Added name");
   //      res.redirect('/');
   //    });

    client.sismember("studentset", req.body.nom, function(err, rep){
    // body...
    if(rep === 0){
      client.srem("studentset", req.params.stud, function(err, rep){
        console.log("deleted a student");
        client.sadd("studentset", req.body.nom, function() {
        // body...
          console.log("Added name");
          res.redirect('/');
        });
      }); 
    } else{
      console.log("Name was not added");
      res.redirect('/');
    }
  });

  });
// });

app.post('/create', function(req, res){ //post or create
  var sname = req.body.nom;
  console.log("in post");
  client.sismember("studentset", sname, function(err, rep){
    // body...
    if(rep === 0){
      client.sadd("studentset", sname, function() {
        // body...
        console.log("Added name");
        res.redirect('/');
      });
    } else{
      console.log("Name was not added");
      res.redirect('/');
    }
  });
  // res.render('index');
});

app.delete('/deleteall', function(req, res){ //delete all students
  client.del("studentset", function(err, rep){
    console.log("deleted entire set");
    res.redirect('/');
  });
  // res.render('index');
});

app.delete('/delete/:stud', function(req, res){ //delete one student
  client.srem("studentset", req.params.stud, function(err, rep){
    console.log("deleted a student");
    res.redirect('/');
  });
});


//starting server
app.listen(3000, function(){
  console.log("Server starting on port 3000");
});