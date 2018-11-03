const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let roomSchema = new Schema({
    roomId:{
        type : String,
        required : true,
        unique : true
    },
    roomName : {
        type : String,
        required : true
    },
    capacity : {
        type : Number,
        required : true,
        min : 2,
        max : 50
    },
    ownerId : {
        type : String,
        required : true
    },
    ownerName : {
        type : String,
        required : true
    },
    active : {
        type: Boolean,
        default : true
    },
    joinees : [{_id : false,
        userId :{
        type : String,
        required : true
    },
        userName : {
            type : String,
            required : true
        }}]
})

mongoose.model('Room',roomSchema)