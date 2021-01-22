/*********************************************************************************
 * WEB422 – Assignment 1
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Parsa Parichehreh Student ID: 156794182  Date: 1/22/2021
 * Heroku Link: _______________________________________________________________
 *
 ********************************************************************************/


const express = require("express"); // express 

const cors = require("cors"); // core

const bodyParser = require('body-parser'); // bodyParser

const app = express(); // app

const RestaurantDB = require("./modules/restaurantDB.js");

app.use(bodyParser.json());

app.use(cors());

const db = new RestaurantDB("mongodb+srv://web422:web@12345@web422.nnafl.mongodb.net/web422?retryWrites=true&w=majority");

const HTTP_PORT = process.env.PORT || 8080;


// =====================================================

app.get("/", (req, res) => {
    res.json({ message: "Listen" });
});

// ================================================

app.post("/api/restaurants", (req, res) => {

    db.addNewRestaurant(req.body)

    .then(() => {
            res.status(201).json('new restaurant added ')
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

// ===============================================

// paging restaurant

app.get("/api/restaurants", (req, res) => {

    let temp_page = req.query.page;

    let temp_perpage = req.query.perPage;

    let The_temp_borough = req.query.borough;



    if (!/^[1-9]+$/.test(temp_page)) {
        res.status(400).json({ message: 'Invalid page, must be number!' });

    }

    // ================================

    if (!/^[1-9]+$/.test(temp_perpage)) {
        res.status(400).json({ message: 'Invalid perPage, must be number!' });

    }

    // =======================================

    if (!/^[a-zA-Z]+$/.test(The_temp_borough)) {
        res.status(400).json({ message: 'Invalid borough, must be alphabetic!' });

    }


    // =================================================================

    db.getAllRestaurants(temp_page, temp_perpage, The_temp_borough)

    .then((restaurants) => {
            res.status(200).json(restaurants);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

// ===============================================


// get restaurant 

app.get("/api/restaurants/:id", (req, res) => {
    db.getRestaurantById(req.params.id)


    .then((restaurants) => {
            res.status(200).json(restaurants);
        })
        .catch((error) => {
            res.status(404).json(error);
        });

});

// ===================================================

// delete

app.delete("/api/restaurants/:id", (req, res) => {

    db.deleteRestaurantById(req.params.id)
    res.status(204).end();
});

// ================================================


// put 

app.put("/api/restaurants/:id", (req, res) => {

    db.updateRestaurantById(req.body, req.params.id)
        .then(() => {
            res.status(200).json(`restaurant ${req.body._id} success updated`);
        })
        .catch((error) => {
            res.status(404).json(error);
        });
});

// ====================================================================

db.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((error) => {
    console.log(error);
});