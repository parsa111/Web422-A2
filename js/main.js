/*********************************************************************************
 *  WEB422 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Parsa Parichehreh Student ID: 156794182 Date: February 5, 2021
 *
 *
 ********************************************************************************/

let current = {};

let Data = [];

let perPage = 10; // perpage

let map = null; // map == null 

let page = 1; // page


// =====================================================

const tableRows = _.template(` 

<% _.forEach(restaurants, function(restaurant) { %>
   
  <tr data-id="<%= restaurant._id %>">
  
  <td><%- restaurant.name %></td>
  
  <td><%- restaurant.cuisine %></td>
  
  <td><%- restaurant.address.building %> <%- restaurant.address.street %></td>
  
  <td><%- avg(restaurant.grades) %></td>
  
  </tr>
<% }); %>
`);

// ===========================================================================

// Average 

const avg = (The_grades) => {

    let SUM = 0; // sum

    let COUNTS = 0; // Counts

    The_grades.forEach((The_grades) => {

        SUM += The_grades.score;

        COUNTS++;

    });

    return (SUM / COUNTS).toFixed(2); // return (SUM / COUNTS).toFixed(2)
};

// ==========================================================================

const set_Current_Restaurant = (id) => {

    const res = Data.find((res) => res._id === id);

    current = res;

    $('.modal-title').text(current.name);

    $('#restaurant-address').text(

        `${current.address.building} ${current.address.street}`

    );

    $('#restaurant-modal').modal();
};

// ===========================================================

const load_Restaurants_Data = async() => {

    const res = await fetch(

        `  http://web422assi1.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`
    );

    const r = await res.json();

    Data = r;

    const template_Restaurants = tableRows({ restaurants: r });

    $('tbody').empty().append(template_Restaurants);

    $('#current').text(page);
};

// =======================================================================

const handlePrev = () => {

    if (page > 1) {

        page--;

        load_Restaurants_Data();
    }
};

// ===========================================================================

function render_Map() {

    const { coord } = current.address;

    map = new L.Map('leaflet', {

        center: [coord[1], coord[0]],

        zoom: 19,

        layers: [

            new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
        ],
    });
    L.marker([coord[1], coord[0]]).addTo(map);
}

//=============================================================

function delete_Map() {

    map.remove();
}


// =================================================

const handle = () => {

    page++;

    load_Restaurants_Data();
};


// =============================================


$(document).ready(() => {

    load_Restaurants_Data();

    $('#restaurantTable').on('click', 'tr', (e) => {

        set_Current_Restaurant($(e.target.parentElement).attr('data-id'));
    });

    // ----------------------------------------------------

    $('#previous').click(handlePrev);

    $('#next').click(handle);

    $('#restaurant-modal').on('shown.bs.modal', render_Map);

    $('#restaurant-modal').on('hidden.bs.modal', delete_Map);
});