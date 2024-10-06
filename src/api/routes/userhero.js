const express = require('express');
const router = express.Router();
const Heroe = require('../../modelos/heroes');
const Usuario = require('../../modelos/usuarios');

// Obtener toda la lista de heroes existentes
router.get('/', async (req, res) => {
    try {
        const heroes = await Heroe.find();
        res.status(200).json(heroes);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener un heroe por campo 'user' de los usuarios
router.get('/:user', async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ user: req.params.user })
            .populate('heroe')
            .select('heroe');
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(200).json(usuario);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Agregar o cambiar heroe al jugador
router.post('/add', async (req, res) => {
    const { user, nombreHeroe } = req.body;

    try {
        // Verifica si el usuario existe buscando por el campo "user"
        const userData = await Usuario.findOne({ user });
        if (!userData) {
            return res.status(404).json({ error: 'Jugador no encontrado.' });
        }

        let objeto = null;

        try {
            objeto = await Heroe.findOne({ name: nombreHeroe });
            if (!objeto) throw new Error();
        } catch (error) {
            // Si no se encuentra el objeto en la colección de héroes
            return res.status(404).json({ error: 'Heroe no encontrado.' });
        }

        // Asigna el héroe al usuario
        userData.heroe = objeto._id;

        // Guarda el usuario con el nuevo héroe asignado
        await userData.save();

        res.status(200).json({ message: 'Héroe asignado exitosamente al jugador.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

module.exports = router;
