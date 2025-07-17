const Blog = require("../models/blogModel.js");

const createBlog = async (req, res) => {
    try {
        const { title, image, description, publishedDate } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const blog = new Blog({
            title,
            image,
            description,
            publishedDate: publishedDate
                ? new Date(publishedDate).toDateString()
                : new Date().toDateString()
        });

        await blog.save();

        res.status(201).json({ message: "Blog created successfully", blog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating blog" });
    }
};


const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.status(200).json({ blogs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching blogs" });
    }
};

const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ blog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching blog" });
    }
}

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, image, description, publishedDate } = req.body;

        const blog = await Blog.findByIdAndUpdate(id, { title, image, description, publishedDate }, { new: true });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ message: "Blog updated successfully", blog });
    } catch (error) {
        res.status(500).json({ message: "Error updating blog" })
    }
}

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog" })
    }
}



module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};
