import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    image: {type: String, required: true},
    cartitemid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    ordersid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    area: {type: String, required: true},
    city: {type: String, required: true},
    city_code: {type: String, required: true},
    state: {type: String, required: true},
})

const User = mongoose.model('User', userSchema)

export default User