const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "you need to give a title use --title"],
        unique: true
    },
    actor: {
        type: String,
        default: "Not Known",
    },
    director: {
        type: String,
        default: "Not Known",
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
    },
    addedAT: {
        type: Date,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    }
})

movieSchema.statics.findByFilterObj = function (query) {
    console.log("find filter: ", query)
    return this.find(query, "title actor director rating addedAT updatedAt");
}
movieSchema.statics.displayTable = function (data) {
    if (data === undefined || data === null) {
        console.log("No documents found");
    }
    else {
        data = JSON.parse(JSON.stringify(data));
        console.table(data, ["title", "actor", "director", "rating", "addedAT", "updatedAt"])
    }
}

module.exports = mongoose.model("Movie", movieSchema)