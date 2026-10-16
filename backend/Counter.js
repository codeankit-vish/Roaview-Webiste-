const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    sequence: {
        type: Number,
        default: 0
    }
});

counterSchema.statics.getCurrentYearCounterId = function (type) {
    return `${type}-${new Date().getFullYear()}`;
};

module.exports = mongoose.model("Counter", counterSchema);