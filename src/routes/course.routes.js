const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { checkRole } = require('../Middleware/auth.Middleware');

// Soumettre le formulaire de création de cours (POST)
router.post('/create', checkRole(['teacher']), courseController.postCreateCourse);
router.get('/allcourse', courseController.getAllCourses);

module.exports = router;
