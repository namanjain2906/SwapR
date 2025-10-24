import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    clerkId: { type: String, unique: true, sparse: true, index: true },
    name: {type: String, required: true},
    email: {type: String, required: true},
    image: {type: String, required: true},
    cartitemid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    ordersid: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    productsid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    area: {type: String},
    city: {type: String},
    city_code: {type: String},
    state: {type: String},
    buy_requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    sell_requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    rent_requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rent" }], // pending rentals the user requested
    rent_sell_requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rent" }], // pending rentals awaiting seller action
    rent_orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rent" }], // confirmed/active rentals
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User