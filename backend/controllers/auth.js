const { validationResult } = require('express-validator');

const nodemailer = require('nodemailer');
require('dotenv').config();
const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Puedes cambiar esto por cualquier otro servicio de correo
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
        console.error('Error de verificación del transporter:', error);
    } else {
        console.log('Servidor listo para enviar correos');
    }
});

exports.sendPasswordResetEmail = async (req, res, next) => {
    const { email } = req.body;
    
    try {
        // Verifica si el usuario existe
        const user = await User.find(email);

        if (user[0].length !== 1) {
            const error = new Error('A user with this email could not be found')
            error.statusCode = 401;
            throw error;
        }

        const storedUser = user[0][0];

        // Genera un token de restablecimiento
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // Token válido por 1 hora

        // Guarda el token y su expiración en el usuario
        storedUser.resetPasswordToken = resetToken;
        storedUser.resetPasswordExpiry = resetTokenExpiry;

        await User.saveResetToken(storedUser.id, resetToken, resetTokenExpiry); // Esta función debe guardar el token y su expiración en la base de datos

        // URL de restablecimiento de contraseña
        const resetUrl = `http://localhost:4200/reset-password?token=${resetToken}`;
        
        // Configura el correo
        const mailOptions = {
            from: 'sattva.syb@gmail.com',
            to: email,
            subject: 'Restablecimiento de Contraseña',
            html: `
                <p>Has solicitado restablecer tu contraseña.</p>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="${resetUrl}">Restablecer Contraseña</a>
                <p>Si no solicitaste este correo, ignóralo.</p>
            `,
        };

        // Envía el correo
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Correo de restablecimiento enviado' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

// Restablecer la contraseña
exports.resetPassword = async (req, res) => {
    console.log("Funciona resetPassword");
    const { token, newPassword } = req.body;
    try {
        const [user] = await User.findByResetToken(token);
        if (user.length === 0 || user[0].resetPasswordExpiry < Date.now()) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await User.updatePassword(user[0].id, hashedPassword);

        res.status(200).json({ message: 'Contraseña restablecida con éxito' });
    } catch (err) {
        console.error('Error al restablecer la contraseña:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return console.error("Error "+errors);
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const userDetails = {
            name: name,
            email: email,
            password: hashedPassword,
        }

        const result = await User.save(userDetails);

        res.status(201).json({ message: 'User registered' })
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.find(email);

        if (user[0].length !== 1) {
            const error = new Error('A user with this email could not be found')
            error.statusCode = 401;
            throw error;
        }

        const storedUser = user[0][0];

        const isEqual = await bcrypt.compare(password, storedUser.password);

        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                email: storedUser.email,
                userId: storedUser.id,
                role: storedUser.role
            },
            'secretfortoken',
            { expiresIn: '1h' }
        );

        res.status(200).json({ token: token, userId: storedUser.id, role: storedUser.role })
    } catch (err) {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
    }
};

exports.googleLogin = async (req, res, next) => {
    const { token } = req.body;
    const decoded = jwt.decode(token);

    try {
        let user = await User.find(decoded.email);
        if (user[0].length === 0) {
            const newUser = {
                googleId: decoded.sub,
                name: decoded.name,
                email: decoded.email
            };
            await User.save(newUser);
            user = await User.find(decoded.email);
        }

        res.status(200).send(user[0][0]);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};



  