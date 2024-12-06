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

// Add a new blog  
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

// Keep only one copy of each handler and remove all duplicates