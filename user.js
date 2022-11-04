// dependencies
require("dotenv").config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


// connect to database
mongoose.connect(process.env.MONGODB_URI);


// Create Model
const User = new Schema({
    active: Boolean,
    username: String, //replace usernameFiled with email
    password: String
});

const options = {
    //usernameField: 'email', //replace usernameFiled with email 
    //usernameQueryFields: [{'email'}],
    errorMessages: {
        UserExistsError: 'A user with the given email is already registered'
    },
    findByUsername: function(model, queryParameters) {
        // Add additional query parameter - AND condition - active: true
        queryParameters.active = true;
        return model.findOne(queryParameters);
      },
    

}

// Export Model
User.plugin(passportLocalMongoose, options);

module.exports = mongoose.model('User', User);
