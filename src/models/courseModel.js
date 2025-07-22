const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: String,
    instructor: {
        type: mongoose.Schema.Types.ObjectId, // or mongoose.Schema.Types.ObjectId if you want to reference a Trainer/User
        ref: 'Trainer',
        required: true
    },
    certified: {
        type: Boolean,
        default: false
    },
    image: String, // URL or path to image
    description: String,
    whatYoullLearn: [String],
    experience: String,
    certificate: String,
    kit: String,
    location: String,
    duration: String,
    review: Number, // Consider splitting into rating (Number) and reviewCount (Number) for better querying
    price: Number,  // Consider using Number for price and a separate field for currency
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
