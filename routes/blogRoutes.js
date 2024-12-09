const express = require('express');
const {
    addBlog,
    listBlogs,
    updateBlog,
    deleteBlog,
    getBlogById,
} = require('../handlers/blogHandler');

const router = express.Router();

// Add a new blog
router.post('/', addBlog);

// List all blogs
router.get('/', listBlogs);

// Update a blog by ID
router.put('/:id', updateBlog);

// Delete a blog by ID
router.delete('/:id', deleteBlog);

// Use the existing getBlogById handler instead of defining a new one
router.get('/:id', getBlogById);

module.exports = router;
