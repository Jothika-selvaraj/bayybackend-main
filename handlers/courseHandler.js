const multer = require('multer');
const path = require('path');
const Course = require('../models/courseModel');
const fs = require('fs');
const express = require('express');

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}



// // Add a new blog  
const addCourse = async (req, res) => {
    try {
        const { title, content, author } = req.body;

        // Validate required fields
        if (!title || !content || !author) {
            return res.status(400).json({ error: 'Title, content, and author are required' });
        }

        // Get the image path
        const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
        const host = `${req.protocol}://${req.get('host')}`;
        
        const newCourse = new Course({
            title,
            content,
            author,
            image: req.file ? `${host}${imagePath}` : ''
        });

        const savedCourse = await newCourse.save();
        res.status(201).json({ success: true, course: savedCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add course' });
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


const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate if id is provided
        if (!id) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        const course = await Course.findById(id);
        
        if (!course) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.status(200).json(blog);
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
};


// List all blogs
const listCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to list blogs' });
    }
};

// Update a blog by ID
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author } = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { title, content, author },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json(updatedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update course' });
    }
};

// Delete a blog by ID
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json(deletedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete course' });
    }
};

// Export middleware and handlers
module.exports = {
    addCourse: [upload.single('image'), addCourse], // apply multer as middleware to handle file uploads
    listCourses,
    updateCourse,
    deleteCourse,
    getCourseById 
};