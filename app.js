const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const app = express();
const path =  require('path');
const passport = require("passport");

//load routes
const ideas =  require('./routes/ideas');
const users =  require('./routes/users');

//pasport config
require('./config/passport')(passport);

// Map global promise - get rid of warnings
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
.then( () => console.log("MongoDB Connected...") )
.catch( err => console.log(err) )

const port =  5000;

//Handlebars Middleware -
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));
app.set("view engine", "handlebars");

// Body Parser middleware function
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//static folder
app.use(express.static(path.join(__dirname,'public')));

/*
Req & Res are Default HttpResponse Object.
*/
app.get('/',(req, res) => {
    const wel =  'Welcome1';
    res.render('index',{
        title: wel
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

//use routes
app.use('/ideas', ideas);
app.use('/users',users);

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});