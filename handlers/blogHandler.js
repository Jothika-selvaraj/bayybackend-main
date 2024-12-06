const multer = require('multer');
const path = require('path');
const Blog = require('../models/blogModel');
const fs = require('fs');
const express = require('express');

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}



// // Add a new blog  
const addBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;

        // Validate required fields
        if (!title || !content || !author) {
            return res.status(400).json({ error: 'Title, content, and author are required' });
        }

        // Set a default image URL if no image is uploaded
        let imageUrl = 'default-image-url.jpg';  // Add a default image URL
        if (req.file) {
            const host = `${req.protocol}://${req.get('host')}`;
            imageUrl = `${host}/uploads/${req.file.filename}`;
        }

        const newBlog = new Blog({
            title,
            content,
            author,
            image: imageUrl  // This will now always have a value
        });

        const savedBlog = await newBlog.save();
        res.status(201).json({ success: true, blog: savedBlog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add blog' });
    }
};


// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });


const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate if id is provided
        if (!id) {
            return res.status(400).json({ error: 'Blog ID is required' });
        }

        const blog = await Blog.findById(id);
        
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.status(200).json(blog);
    } catch (error) {
        console.error('Error fetching blog by ID:', error);
        res.status(500).json({ error: 'Failed to fetch blog' });
    }
};
ffv

// List all blogs
const listBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to list blogs' });
    }
};

// Update a blog by ID
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { title, content, author },
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.status(200).json(updatedBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update blog' });
    }
};

// Delete a blog by ID
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.status(200).json(deletedBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete blog' });
    }
};

// Export middleware and handlers
module.exports = {
    addBlog: [upload.single('image'), addBlog], // apply multer as middleware to handle file uploads
    listBlogs,
    updateBlog,
    deleteBlog,
    getBlogById 
};