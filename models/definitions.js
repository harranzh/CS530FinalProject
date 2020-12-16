const mongoose = require('mongoose');

const definitionSchema = new mongoose.Schema({
    definition:{
        type: String,
        required: true
    },
    image:{
        type: String
    }
});

module.exports = new mongoose.model('Definition', definitionSchema);
