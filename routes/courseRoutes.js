const express = require('express');
const router = express.Router();
const {
    addCourse,
    listCourses,
    updateCourse,
    deleteCourse,
    getCourseById
} = require('../handlers/courseHandler');

// Define routes
router.post('/', addCourse);
router.get('/', listCourses);
router.get('/:id', getCourseById);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;
