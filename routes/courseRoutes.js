const express = require('express');
const router = express.Router();
const { 
    addCourse, 
    listCourses, 
    getCourseById, 
    updateCourse, 
    deleteCourse 
} = require('../handlers/courseHandler');

// Course routes
router.post('/', addCourse);
router.get('/', listCourses);
router.get('/:id', getCourseById);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;
