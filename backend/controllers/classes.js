// const Class = require('../models/class');

// exports.getAllClasses = async (req, res) => {
//     try {
//         const classes = await Class.findAll();
//         res.json(classes);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// exports.createClass = async (req, res) => {
//     try {
//         console.log("creando clase "+req.body.title);
//         const newClass = await Class.create(req.body);
//         res.status(201).json(newClass);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

// exports.updateClass = async (req, res) => {
//     try {
//         const updatedClass = await Class.findByPk(req.params.id);
//         if (!updatedClass) {
//             return res.status(404).json({ message: 'Class not found' });
//         }
//         await updatedClass.update(req.body);
//         res.json(updatedClass);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

// exports.deleteClass = async (req, res) => {
//     try {
//         await Class.destroy({ where: { id: req.params.id } });
//         res.json({ message: 'Class deleted' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

const db = require('../config/database');
const fs = require('fs')
const SattvaClass = require('../models/class');
const path = require('path');
const { validationResult } = require('express-validator');

exports.getAllClasses = async (req, res, next) => {
  // const sql = 'SELECT * FROM Classes';
  // db.query(sql, (err, results) => {
  //   if (err) throw err;
  //   res.json(results);
  // });
  try {
    const [allClasses] = await SattvaClass.fetchAll();
    res.status(200).json(allClasses);
  } catch (err) {
    if (!err.statusCode) {err.statusCode = 500;}
    next(err);
}
};

exports.addClass = async (req, res, next) => {
  const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return console.error("Error "+errors);
    }

    const { title, description, instructor_id, monthlyFee } = req.body;
    const imageUrl = req.file.path;

    try {
        const newClass = {
            title: title, 
            description: description,
            instructor_id: instructor_id,
            monthlyFee: monthlyFee,
            imageUrl: imageUrl
        }

        const result = await SattvaClass.save(newClass);

        res.status(201).json({ message: 'The class was added', class: newClass })
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
};

// exports.addClass = (req, res) => {
//   const { title, description, instructor_id } = req.body;
//   const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  
//   if (!title || !description || !imageUrl || !instructor_id) {
//       return res.status(400).json({ error: 'All fields are required' });
//   }
  
//   SattvaClass.save();

//   const query = 'INSERT INTO Classes (title, description, imageUrl, instructor_id) VALUES (?, ?, ?, ?)';
//   db.query(query, [title, description, imageUrl, instructor_id], (err, results) => {
//       if (err) {
//           return res.status(500).json({ error: err.message });
//       }
//       res.status(201).json({ message: 'Class added successfully', classId: results.insertId });
//   });
// };

// exports.deleteClass = (req, res) => {
//   const { id } = req.params;
//   const sql = 'DELETE FROM Classes WHERE id = ?';
//   db.query(sql, id, (err) => {
//     if (err) throw err;
//     res.status(204).send();
//   });
// };

exports.deleteClass = async (req, res, next) => {
  console.log("Borrando clase "+req.params.id)
    try {
        const [classData] = await SattvaClass.findById(req.params.id);
        
        if (classData.length === 0) {
            throw new Error(`No se encontró ningúna clase con el id ${req.params.id}`);
        }
        
        const { id: classId, imageUrl } = classData[0];

        if (fs.existsSync(imageUrl)) {
            fs.unlinkSync(imageUrl);
        }

        const deleteResponse = await SattvaClass.delete(classId);

        res.status(200).json(deleteResponse);
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
};
