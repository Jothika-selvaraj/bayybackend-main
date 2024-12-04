const express = require('express');
const {
    addCourse,
    listCourses,
    updateCourse,
    deleteCourse,
} = require('../handlers/courseHandler');

const router = express.Router();

// Add a new blog
router.post('/', addCourse);

// List all blogs
router.get('/', listCourses);

// Update a blog by ID
router.put('/:id', updateCourse);

// Delete a blog by ID
router.delete('/:id', deleteCourse);

module.exports = router;
