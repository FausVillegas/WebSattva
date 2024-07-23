import { existsSync, unlinkSync } from 'fs';
import SattvaEvent from '../models/event.js';
import path from 'path';
import { validationResult } from 'express-validator';

export async function getAllEvents(req, res, next) {
    try {
        const [allEvents] = await SattvaEvent.fetchAll();
        res.status(200).json(allEvents);
    } catch (err) {
        if (!err.statusCode) { err.statusCode = 500; }
        next(err);
    }
}

export async function addEvent(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return console.error("Error " + errors);
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
        if (!err.statusCode) { err.statusCode = 500; }
        if (existsSync(imageUrl)) {
            unlinkSync(imageUrl);
        }
        next(err);
    }
}

export async function deleteEvent(req, res, next) {
    console.log("Borrando evento " + req.params.id)
    try {
        const [eventData] = await SattvaEvent.findById(req.params.id);
        if (eventData.length === 0) {
            throw new Error(`No se encontró ningún evento con el id ${req.params.id}`);
        }
        const { id: eventId, imageUrl } = eventData[0];

        if (existsSync(imageUrl)) {
            unlinkSync(imageUrl);
        }

        const deleteResponse = await SattvaEvent.delete(eventId);

        res.status(200).json(deleteResponse);
    } catch (err) {
        if (!err.statusCode) { err.statusCode = 500; }
        next(err);
    }
}