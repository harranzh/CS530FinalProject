if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const dictData = require('./utils/dictData');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const User = require('./models/user');
const Definitions = require('./models/definitions');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const checkWord = require('check-word'); // js library to check if word is valid english
word = checkWord('en'); // setup language to check
const initializePassport = require('./passport-config');

initializePassport(passport, email => {
    return User.findOne({ email : email })
});

// Mongoose Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/UsersDefinitions', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify : true });
 
app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs');

app.use(express.urlencoded({ extended : false }));
app.use(flash())
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated,function(req, res){
    res.render('main.ejs');
});

app.get('/login', checkNotAuthenticated,function(req, res){
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, function(req, res){
    res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async function(req, res){
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        var user_instance = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        // console.log(user_instance);
        user_instance.save(function(error){
            if (error){
                return error
            }
        })
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
});

app.delete('/logout', function(req, res){
    req.logOut()
    res.redirect('/login');
})

app.get('/dict', function(req, res){
    const definition = req.query.definition;

    if(!definition){
        res.render('error.ejs', {
            error: 'You must enter a word to view its definition.'
        })
    }

    if(word.check(definition)){
        dictData(definition, function(error, {definition, artwork}){
            if(error) {
                return res.send({
                    error
                })
            }
            var def_instance = new Definitions({
                definition: definition,
                image: artwork
            })
            def_instance.save(function(e){
                if(e){
                    return e
                }
            })
            res.render('show.ejs', {
                definition: definition,
                artwork: artwork
            })
        })
    } else {
        res.render('error.ejs', {
            error: 'You must enter a valid word to view its definition.'
        })
    }
    
});

// Middlewear Functions
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    } else {
        res.redirect('/login');
    }
}
function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}

app.listen(process.env.PORT || 8000, function(){
    console.log('Connected to localhost:8000');
});