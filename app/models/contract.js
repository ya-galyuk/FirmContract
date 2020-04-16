const  mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a schema
const contractSchema = new Schema(
    {
        name: {
            type: String,
            nullable: true
        },
        number:{
            type: String,
            nullable: true
        },
        sum:{
            type: Number,
            nullable: true
        },
        dateStart:{
            type: Date,
            nullable: true
        },
        dateFinish:{
            type: Date,
            nullable: true
        },
        prepayment:{
            type: Number,
            nullable: true
        },
        firmId:{
            type: Schema.Types.ObjectID,
            ref: 'firms',
            nullable: true
        }
    },
    {
        timestamps: true
    }
);

//create the model
const contractModel  = mongoose.model('Contract', contractSchema);

//export the model
module.exports = contractModel;
