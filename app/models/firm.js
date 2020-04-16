const  mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a schema
const firmSchema = new Schema(
    {
        name: {
            type: String,
            nullable: true
        },
        ceo:{
            type: String,
            nullable: true
        },
        address:{
            type: String,
            nullable: true
        }
    },
    {
        timestamps: true
    }
);

//middleware ======================
// make sure that the slug is created from the name
firmSchema.pre('save', function (next) {
    this.name = slugify(this.name);
    next();
});

//create the model
const firmModel  = mongoose.model('Firm', firmSchema);

//export the model
module.exports = firmModel;

// function to slugify a name
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}