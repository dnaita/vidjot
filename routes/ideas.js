const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//load ideas Model
require('../models/Idea')
const Idea = mongoose.model('ideas');

// index page
router.get('/', (req, res) => {
    // console.log(Idea.find({}));
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            console.log(ideas);
            res.send(ideas);
        });
});


//add Idea form
router.get("/add", (req, res) => {
    res.render("ideas/add");
});

//process forms
router.post('/', (req, res) => {
    console.log(req.body);
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: "Please add a title" });
    }
    if (!req.body.details) {
        errors.push({ text: "Please add some Details" });
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        };
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/');
            })
    }
});

//Get a specific id
router.get('/:id', (req, res) => {
    Idea.findById({
        _id: req.params.id
    })
        .then(idea => {
            console.log(idea);
            res.send(idea);
        });
});

//Update a specific Idea
router.put('/:id', (req, res) => {
    Idea.findById({
        _id: req.params.id
    }).then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save().then(idea => {
            res.send(idea);
        });
    });
});

//Removing a Data
router.delete('/:id', (req, res) => {
    Idea.remove({
        _id: req.params.id
    }).then(() => {
        res.send('Deleted');
    });
});


module.exports = router;