import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    image: {type: String, required: true},
    cartitemid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    ordersid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    productsid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    area: {type: String},
    city: {type: String},
    city_code: {type: String},
    state: {type: String},
})

const User = mongoose.model('User', userSchema)

export default User