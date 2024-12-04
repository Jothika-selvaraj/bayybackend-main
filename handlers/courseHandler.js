const Course = require('../models/courseModel');

// Add a new blog
const addCourse = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        if (!title || !content || !author) {
            return res.status(400).json({ error: 'Title, content, and author are required' });
        }

        const newCourse = new Course({ title, content, author });
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add blog' });
    }
};
// List all blogs
const listCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to list ' });
    }
};

// Update a blog by ID
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author } = req.body;

        const updatedCourse = await Blog.findByIdAndUpdate(
            id,
            { title, content, author },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ error: 'course not found' });
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

        const deletedCourse = await Blog.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({ error: 'course not found' });
        }

        res.status(200).json(deletedBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete course' });
    }
};

module.exports = { addCourse, listCourses, updateCourse, deleteCourse };