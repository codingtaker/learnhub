const Course = require('../models/course.models');

// POST : Créer un nouveau cours
exports.postCreateCourse = async (req, res) => {
    try {
        console.log('Requête reçue pour créer un cours:', req.body);

        const {
            title,
            category,
            level,
            imageUrl,
            date,
            duration,
            maxStudents,
            description
        } = req.body;

        // On récupère le nom du formateur depuis la session
        const instructorName = req.session.user.firstName + ' ' + req.session.user.lastName;
        console.log('Nom du formateur:', instructorName);
 
        if (!title || !instructorName || !category || !level || !date || !maxStudents || !description) {
            console.warn('Champs manquants lors de la création du cours');
            return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires.' });
        }

        const newCourse = new Course({
            title,
            instructorName,
            category,
            level,
            imageUrl,
            date,
            duration,
            maxStudents,
            description
        });

        console.log('Nouveau cours à enregistrer:', newCourse);

        await newCourse.save();
        console.log('Cours créé avec succès:', newCourse._id);

        return res.status(201).json({ message: 'Cours créé avec succès.', course: newCourse });
    } catch (error) {
        console.error('Erreur lors de la création du cours:', error);
        return res.status(500).json({ error: error.message });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        return res.status(200).json({ courses });
    } catch (error) {
        console.error('Erreur lors de la récupération des cours:', error);
        return res.status(500).json({ error: error.message });
    }
};
