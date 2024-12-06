const multer = require('multer');
const path = require('path');
const Blog = require('../models/blogModel');
const fs = require('fs');
const express = require('express');
// Ensure uploads directory exists
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

        // Validate file upload
       // if (!req.file) {
        //    return res.status(400).json({ error: "Image is required" });
        //}

        // Get the image path and create blog entry
        // const imagePath = `/uploads/${req.file.filename}`;
        // const host = `${req.protocol}://${req.get('host')}`;
        
        const newBlog = new Blog({
            title,
            content,
            author,
            image: `${host}${imagePath}`
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
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blogModel');
const fs = require('fs');
const express = require('express');
// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}


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


// // Add a new blog  
const addBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;

        // Validate required fields
        if (!title || !content || !author) {
            return res.status(400).json({ error: 'Title, content, and author are required' });
        }

        // Create blog object first without the image
        const blogData = {
            title,
            content,
            author,
            image: null
        };

        // Add image if it exists
        if (req.file) {
            const host = `${req.protocol}://${req.get('host')}`;
            const imagePath = `/uploads/${req.file.filename}`;
            blogData.image = `${host}${imagePath}`;
        }

        const newBlog = new Blog(blogData);
        const savedBlog = await newBlog.save();
        res.status(201).json({ success: true, blog: savedBlog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add blog' });
    }
};


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