import db from '../util/database.js';

export default class SattvaClass {
    constructor(title, description, instructor_id, imageUrl, monthlyFee){
        this.title = title;
        this.description = description;s
        this.instructor_id = instructor_id;
        this.imageUrl = imageUrl;
        this.monthlyFee = monthlyFee;
    }

    static fetchAll() {
        return db.execute('SELECT * FROM classes');
    }

    static save(classData) {
        return db.execute(
            'INSERT INTO classes (title, description, imageUrl, instructor_id, monthly_fee) VALUES (?, ?, ?, ?, ?)', 
            [classData.title, classData.description, classData.imageUrl, classData.instructor_id, classData.monthlyFee]
        );
    }

    static delete(id) {
        return db.execute('DELETE FROM classes WHERE id = ?',[id]);
    }

    static findById(id) {
        return db.execute('SELECT * FROM classes WHERE id = ?',[id]);
    }

    static updateClass(classData) {
        return db.execute('SELECT * FROM classes WHERE id = ?',[id]);
    }

    static saveSchedule(schedule) {
        return db.execute('INSERT INTO Schedules (day_of_week, time) VALUES (?, ?)', [schedule.day_of_week, schedule.time]);
    }

    static saveClassSchedule(classId, scheduleId) {
        return db.execute('INSERT INTO ClassSchedule (class_id, schedule_id) VALUES (?, ?)', [classId, scheduleId]);
    }
};

// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Class = sequelize.define('Class', {
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     description: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     imageUrl: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     instructor_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     }
// }, {
//     timestamps: false
// });

// module.exports = Class;
