// const Event = require('../models/event');

// exports.getAllEvents = async (req, res) => {
//     try {
//         const events = await Event.findAll();
//         res.json(events);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// exports.createEvent = async (req, res) => {
//     try {
//         const newEvent = await Event.create(req.body);
//         res.status(201).json(newEvent);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

// exports.updateEvent = async (req, res) => {
//     try {
//         const updatedEvent = await Event.findByPk(req.params.id);
//         if (!updatedEvent) {
//             return res.status(404).json({ message: 'Event not found' });
//         }
//         await updatedEvent.update(req.body);
//         res.json(updatedEvent);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

// exports.deleteEvent = async (req, res) => {
//     try {
//         await Event.destroy({ where: { id: req.params.id } });
//         res.json({ message: 'Event deleted' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// const db = require('../config/database');
const fs = require('fs')
const SattvaEvent = require('../models/event');
const path = require('path');
const { validationResult } = require('express-validator');

exports.getAllEvents = async (req, res, next) => {
  try {
    const [allEvents] = await SattvaEvent.fetchAll();
    res.status(200).json(allEvents);
  } catch (err) {
    if (!err.statusCode) {err.statusCode = 500;}
    next(err);
}
};

exports.addEvent = async (req, res, next) => {
  const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return console.error("Error "+errors);
    }
    
    const { title, description, instructor_id, dateTime, price } = req.body;
    
    const imageUrl = req.file ? req.file.path : null;
    try {
        const newEvent = {
            title: title, 
            description: description,
            instructor_id: instructor_id,
            dateTime: dateTime,
            price: price,
            imageUrl: imageUrl
        }
        
        const result = await SattvaEvent.save(newEvent);
        
        res.status(201).json({ message: 'The event was added', class: newEvent })
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
};

exports.deleteEvent = async (req, res, next) => {
  console.log("Borrando evento "+req.params.id)
    try {
        const [eventData] = await SattvaEvent.findById(req.params.id);
        if (eventData.length === 0) {
            throw new Error(`No se encontró ningún evento con el id ${req.params.id}`);
        }
        const { id: eventId, imageUrl } = eventData[0];
        
        if (fs.existsSync(imageUrl)) {
            fs.unlinkSync(imageUrl);
        }
        
        const deleteResponse = await SattvaEvent.delete(eventId);

        res.status(200).json(deleteResponse);
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
};
