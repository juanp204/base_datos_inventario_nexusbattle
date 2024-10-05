const express = require('express');
const router = express.Router();
const Heroe = require('../../modelos/heroes');
const Usuario = require('../../modelos/usuarios');

// Obtener toda la lista de heroes existentes
router.get('/', async (req, res) => {
    try {
        const heroes = await Heroe.find()
        res.status(200).json(heroes);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener un heroe por id usuarios

router.get('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).populate('heroe').select('heroe');
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(200).json(usuario);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//agregar o cambiar heroe al jugador

router.post('/add', async (req, res) => {
    const { userId, nombreHeroe } = req.body;

    try {
        // Verifica si el usuario existe
        const user = await Usuario.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Jugador no encontrado.' });
        }

        let objeto = null;

        try {
            objeto = await Promise.any([
                Heroe.findOne({ name: nombreHeroe }).then(obj => obj ? obj : Promise.reject())
            ]);
        } catch (error) {
            // Si no se encuentra el objeto en ninguna de las colecciones
            return res.status(404).json({ error: 'Objeto no encontrado.' });
        }

        // Agrega el objeto al inventario del usuario
        user.heroe = objeto._id

        // Guarda el usuario con el nuevo objeto en el inventario
        await user.save();

        res.status(200).json({ message: 'Objeto agregado al inventario exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});
