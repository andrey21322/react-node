const {Schema, model, Types} = require('mongoose')

const Order = new Schema({
   name: {type: String, required: true},
   position: {type: Number, required: true},
   owner: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model("Order", Order)
