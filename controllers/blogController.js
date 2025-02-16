const Blog = require('../models/Blog');

exports.addBlog = async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
