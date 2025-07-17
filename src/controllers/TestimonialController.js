const Testimonial = require("../models/testimonialModel.js");

const createTestimonial = async (req, res) => {
    try {
        const { image, name, designation, description } = req.body;
        if (!image || !name || !designation || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const testimonial = new Testimonial({
            image,
            name,
            designation,
            description
        })

        await testimonial.save();

        res.status(201).json({ message: "Testimonial created successfully", testimonial });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating testimonial" });
    }
}

const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({});
        res.status(200).json({ testimonials });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching testimonials" });
    }
}

const getTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }
        res.status(200).json({ testimonial });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching testimonial" });
    }
}

const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const { image, name, designation, description } = req.body;
        const testimonial = await Testimonial.findByIdAndUpdate(id, { image, name, designation, description }, { new: true });

        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        res.status(200).json({ message: "Testimonial updated successfully", testimonial });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating testimonial" });
    }
}

const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findByIdAndDelete(id);
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }
        res.status(200).json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting testimonial" });
    }
}

module.exports = {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial
}