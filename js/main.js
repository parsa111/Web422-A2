/*********************************************************************************
 *  WEB422 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Parsa Parichehreh Student ID: 156794182 Date: 
 *
 *
 ********************************************************************************/

// Variables
let restaurantData = [];

let currentRestaurant = {};

let page = 1;

let perPage = 10;

let map = null;

// Average Score funtion
const avgScore = (grades) => {
    let sum = 0;
    let count = 0;
    grades.forEach((grade) => {
        sum += grade.score;
        count++;
    });
    return (sum / count).toFixed(2);
};

// Lodash template
const tableRows = _.template(` 
<% _.forEach(restaurants, function(restaurant) { %>
    <tr data-id="<%= restaurant._id %>">
    <td><%- restaurant.name %></td>
    <td><%- restaurant.cuisine %></td>
    <td><%- restaurant.address.building %> <%- restaurant.address.street %></td>
    <td><%- avgScore(restaurant.grades) %></td>
    </tr>
<% }); %>
`);

// Functions
//  // https://peaceful-oasis-15511.herokuapp.com
//  http://web422assignment01.herokuapp.com
// Calculates the average score, given an array of "grades" objects for a specific restaurant

const loadRestaurantsData = async() => {
    const res = await fetch(
        `  http://web422assi1.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`
    );
    const restaurants = await res.json();
    // Set restaurants
    restaurantData = restaurants;
    // Get table template results
    const templateRestaurants = tableRows({ restaurants: restaurants });
    // Append tableRows
    $('tbody').empty().append(templateRestaurants);
    // Set Pagination
    $('#current').text(page);
};

const setCurrentRestaurant = (id) => {
    const restaurant = restaurantData.find((res) => res._id === id);
    currentRestaurant = restaurant;
    // Set Modal Title
    $('.modal-title').text(currentRestaurant.name);
    // Set Modal Content Address
    $('#restaurant-address').text(
        `${currentRestaurant.address.building} ${currentRestaurant.address.street}`
    );
    // Open Modal
    $('#restaurant-modal').modal();
};

const handleNext = () => {
    page++;
    loadRestaurantsData();
};

const handlePrevious = () => {
    if (page > 1) {
        page--;
        loadRestaurantsData();
    }
};

function renderMap() {
    const { coord } = currentRestaurant.address;
    map = new L.Map('leaflet', {
        center: [coord[1], coord[0]],
        zoom: 18,
        layers: [
            new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
        ],
    });
    L.marker([coord[1], coord[0]]).addTo(map);
}

function deleteMap() {
    map.remove();
}

$(document).ready(() => {
    // Load Restaurant Data
    loadRestaurantsData();
    // Click Event
    $('#restaurantTable').on('click', 'tr', (event) => {
        setCurrentRestaurant($(event.target.parentElement).attr('data-id'));
    });
    // Previous page
    $('#previous').click(handlePrevious);
    // Next Page
    $('#next').click(handleNext);
    $('#restaurant-modal').on('shown.bs.modal', renderMap);
    $('#restaurant-modal').on('hidden.bs.modal', deleteMap);
});