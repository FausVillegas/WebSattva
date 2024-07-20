// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
import SattvaEvent from '../models/event.js';
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-6309124147034951-071622-1fe6aeff731e3d4420af8183484da2ec-1903347735' });

import { Router } from 'express';
const router = Router();

// ELIMINAR
router.post("/register-for-event", async (req,res) => {   
    // Esta linea de codigo es para que el usuario quede registrado en el evento a pesar de no haber finalzado el pago
    // ya que para eso se querieren urls de dominios reales. back_urls no permite urls de servidores locales
    await SattvaEvent.registerForEvent(req.body.userId, req.body.eventId);    
});

router.post("/create-preference", async (req,res) => {
    try {
        const body = {
            items: [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: "ARS",
                }
            ],
            back_urls: {
                // success: "http://localhost:4200/",
                // failure: "http://localhost:4200/",
                // pending: "",
                success: "https://www.youtube.com/",
                failure: "https://www.youtube.com/",
                pending: "https://www.youtube.com/",
            },
            auto_return: "approved",
            metadata: {
                userId: req.body.userId, // Get user ID from request body
                eventId: req.body.eventId // Get event ID from request body
            }
        }

        const preference = new Preference(client);
        const result = await preference.create({body});

        res.json({
            id: result.id,
        });
    } catch(error) {
        res.status(500).json({
            error: "Error al crear la preferencia"
        });
    }
});

router.post("/webhook", async (req, res) => {
    try {
        const payment = req.body;

        if (payment.type === 'payment' && payment.data.status === 'approved') {
            const userId = payment.data.metadata.userId; // Assuming you pass the user ID in metadata
            const eventId = payment.data.metadata.eventId; // Assuming you pass the event ID in metadata

            await SattvaEvent.registerForEvent(eventId, userId);
        }

        res.status(200).send('OK');
    } catch (error) {
        res.status(500).send('Error processing webhook');
    }
});

// import { Router } from 'express';
// import { createOrder } from '../controllers/payment.js';

// const router = Router();

// router.get('/create-order',createOrder)

// router.get('/success', (req, res) => res.send('success'))

// router.get('/webhook', (req, res) => res.send('webhook'))

export default router;
