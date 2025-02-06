const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['redwine', 'whitewine', 'rosewine', 'sparklingwine', 'other'],
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String, 
        required: true
    }
},{
    timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);
