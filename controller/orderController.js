const Order = require('../models/Order')
const { validationResult } = require('express-validator')

class orderController {
    async getAll(req, res) {
        try {
            const orders = await Order.find({ owner: req.user.userId })
            res.json(orders)
        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'Get all orders error'})   
        }
    }

    async create(req, res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:'Name can not be empty'})
            }
            const {name, position} = req.body

            const order = new Order({
                name, position, owner: req.user.userId
            })

            await order.save()

            res.status(201).json({message: 'success'})
        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'Create error'})   
        }
    }

    async delete(req, res) {
        try {
            await Order.findByIdAndRemove(req.params.id, { owner: req.user.userId })
            res.status(200).json({message: 'success'})
        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'Delete error'})   
        }
    }

    async edit(req, res) {
        try {
            if(req.body.firstId) {
                
                await Order.findByIdAndUpdate(req.body.firstId, {position: req.body.second, owner: req.user.userId})
                await Order.findByIdAndUpdate(req.body.secondId, {position: req.body.first, owner: req.user.userId})

                return await res.status(200).json({message: 'success'})
            }
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:'Name can not be empty'})
            }
            await Order.findByIdAndUpdate(req.params.id, {name: req.body.name, owner: req.user.userId})
            res.status(200).json({message: 'success'})
        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'Edit error'})   
        }
    }
}

module.exports = new orderController()