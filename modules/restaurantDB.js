const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({

    address: {

        building: String,

        coord: [Number],

        street: String,

        zipcode: String
    },

    // =====================================================

    borough: String,

    cuisine: String,

    grades: [{

        date: Date,

        grade: String,

        score: Number
    }],

    name: String,

    restaurant_id: String
});

// ========================================================================

module.exports = class RestaurantDB {

    constructor(connection_String) {

        this.connection_String = connection_String;

        this.Restaurant = null;
    }

    // ==================================================

    initialize() {

        return new Promise((resolve, reject) => {

            let db = mongoose.createConnection(`mongodb+srv://web422:web@12345@web422.nnafl.mongodb.net/web422?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

            db.on('error', () => {

                reject();
            });
            db.once('open', () => {
                this.The_Restaurant = db.model("restaurants", restaurantSchema);
                resolve();
            });
        });
    }


    // ==================================================

    async addNewRestaurant(The_data) {
        let The_newRestaurant = new this.Restaurant(The_data);
        await The_newRestaurant.save();
        return `new restaurant: ${The_newRestaurant._id} successfully added`
    }

    // ==========================================

    getAllRestaurants(page, perPage, borough) {
        let findBy = borough ? { borough } : {};

        if (+page && +perPage) {
            return this.Restaurant.find(findBy).sort({ restaurant_id: +1 }).skip(page * +perPage).limit(+perPage).exec();
        }

        return Promise.reject(new Error('page and perPage query parameters must be present'));
    }

    // ===========================================================


    getRestaurantById(id) {
        return this.Restaurant.findOne({ _id: id }).exec();
    }

    // ==============================================================

    async updateRestaurantById(The_data, id) {
        await this.Restaurant.updateOne({ _id: id }, { $set: The_data }).exec();
        return `restaurant ${id} success updated`;
    }

    // ============================================================

    async deleteRestaurantById(id) {
        await this.Restaurant.deleteOne({ _id: id }).exec();
        return `restaurant ${id} success deleted`;
    }
}