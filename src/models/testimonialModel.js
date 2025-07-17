const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    image: String,
    name: String,
    designation: String,
    description: String,
})

module.exports = mongoose.model('Testimonial', testimonialSchema);