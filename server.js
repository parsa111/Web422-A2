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


const express = require("express");

const cors = require("cors");

const bodyParser = require('body-parser');

const app = express();

const RestaurantDB = require("./modules/restaurantDB.js");

const db = new RestaurantDB("mongodb+srv://web:web@12345@web422.nnafl.mongodb.net/web?retryWrites=true&w=majority");

const HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use(cors());

// =====================================================

app.get("/", (req, res) => {
    res.json({ message: "listening" });
});

// ================================================

app.post("/api/restaurants", (req, res) => {

    db.addNewRestaurant(req.body)

    .then(() => {
            res.status(201).json('new restaurant successfully added ')
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

// ===============================================

// paging restaurant

app.get("/api/restaurants", (req, res) => {

    let temp_page = req.query.page;
    let temp_perpage = req.query.perPage;
    let temp_borough = req.query.borough;



    if (!/^[1-9]+$/.test(temp_page)) {
        res.status(400).json({ message: 'Invalid page, should be number!' });

    }

    // ================================

    if (!/^[1-9]+$/.test(temp_perpage)) {
        res.status(400).json({ message: 'Invalid perPage, should be number!' });

    }

    // =======================================

    if (!/^[a-zA-Z]+$/.test(temp_borough)) {
        res.status(400).json({ message: 'Invalid borough, should be alphabetic!' });

    }


    // =================================================================

    db.getAllRestaurants(temp_page, temp_perpage, temp_borough)

    .then((restaurants) => {
            res.status(200).json(restaurants);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

// ===============================================


// //--get restaurant
app.get("/api/restaurants/:id", (req, res) => {
    db.getRestaurantById(req.params.id)


    .then((restaurants) => {
            res.status(200).json(restaurants);
        })
        .catch((err) => {
            res.status(404).json(err);
        });

});



//---put restaurant
app.put("/api/restaurants/:id", (req, res) => {

    db.updateRestaurantById(req.body, req.params.id)
        .then(() => {
            res.status(200).json(`restaurant ${req.body._id} successfully updated`);
        })
        .catch((err) => {
            res.status(404).json(err);
        });
});

//---delete
app.delete("/api/restaurants/:id", (req, res) => {
    // Call 
    db.deleteRestaurantById(req.params.id)
    res.status(204).end();
});


db.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});