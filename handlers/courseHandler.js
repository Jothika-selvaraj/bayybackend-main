const multer = require('multer');
const path = require('path');
const Course = require('../models/courseModel');
const fs = require('fs');
const express = require('express');

// Ensure the uploads directory exists
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

// Add a new course
const addCourse = async (req, res) => {
    try {
        const { title, content, author } = req.body;

        // Validate required fields
        if (!title || !content || !author) {
            return res.status(400).json({ error: 'Title, content, and author are required' });
        }

        // Handle image file upload
        let imageUrl = null;
        if (req.file) {
            const host = `${req.protocol}://${req.get('host')}`;
            imageUrl = `${host}/uploads/${req.file.filename}`;
        }

        // Create a new course
        const newCourse = new Course({
            title,
            content,
            author,
            image: imageUrl
        });

        const savedCourse = await newCourse.save();

        // Include the image URL explicitly in the response
        res.status(201).json({ 
            success: true, 
            course: {
                ...savedCourse.toObject(),
                imageUrl: imageUrl // Add the image URL explicitly
            }
        });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ error: 'Failed to add course' });
    }
};



// Get course by ID
const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID parameter
        if (!id) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
};


// List all courses
const listCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 }); // Sort by newest first
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error listing courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};
// Update a course by ID
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author } = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { title, content, author },
            { new: true }
        );

        if (!updateCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json(updatedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update Course' });
    }
};


// Delete a course by ID
// Delete a blog by ID
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID parameter
        if (!id) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        // Find the course first to get its image path
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Delete the image file if it exists
        if (course.image) {
            const imagePath = course.image.split('/uploads/')[1];
            const fullPath = path.join('uploads', imagePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        // Delete the course from database
        const deletedCourse = await Course.findByIdAndDelete(id);
        res.status(200).json({ message: 'Course deleted successfully', course: deletedCourse });

    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: 'Failed to delete course' });
    }
};

// Export middleware and handlers
module.exports = {
    addCourse: [upload.single('image'), addCourse], // Middleware for file upload
    listCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
};




