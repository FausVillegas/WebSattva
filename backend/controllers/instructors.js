const db = require('../config/database');
const fs = require('fs')
const path = require('path');
const { validationResult } = require('express-validator');
const Instructor = require('../models/instructor');

exports.getAllInstructors = async (req, res, next) => {
  try {
    const [allInstructor] = await Instructor.fetchAll();
    res.status(200).json(allInstructor);
  } catch (err) {
    if (!err.statusCode) {err.statusCode = 500;}
    next(err);
}
};

exports.addInstructor = async (req, res, next) => {
  const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return console.error("Error "+errors);
    }

    const { firstName, lastName, email, dni, salary } = req.body;

    try {
        const newInstructor = {
            firstName: firstName, 
            lastName: lastName, 
            email: email, 
            dni: dni, 
            salary: salary
        }

        const result = await Instructor.save(newInstructor);

        res.status(201).json({ message: 'The instructor was added', class: newInstructor })
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
};

exports.deleteInstructor = async (req, res, next) => {
  console.log("Borrando instructor "+req.params.id)
    try {
        const [instructorData] = await Instructor.findById(req.params.id);
        
        if (classData.length === 0) {
            throw new Error(`No se encontró ningún instructor con el id ${req.params.id}`);
        }

        const deleteResponse = await Instructor.delete(req.params.id);

        res.status(200).json(deleteResponse);
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
};
