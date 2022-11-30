const {Schema, model, Types} = require('mongoose')

const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    orders: [{type: Types.ObjectId, ref: 'Order'}]
})

module.exports = model("User", User)