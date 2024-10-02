const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Usuario = require('../../modelos/usuarios'); // Asegúrate de tener la ruta correcta al modelo
const { Weapon, Armor, Item } = require('../../modelos/objetos'); // Modelo de Objetos

// Enpoint obtener el inventario del usuario
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Verifica si el usuario existe
        const user = await Usuario.findById(userId)
            .populate('inventario.objetoId')
            .select('inventario')
            .exec();


        if (!user) {
            return res.status(404).json({ error: 'Jugador no encontrado.' });
        }
        console.log(user)
        // Obtén el inventario del jugador con los detalles de los objetos
        const inventory = {
            inventario: user.inventario,
            inventario_juego: user.inventario_juego
        };

        res.status(200).json(inventory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

//agregar objetos al inventario
router.post('/add', async (req, res) => {
    const { userId, nombreObjeto } = req.body;

    try {
        // Verifica si el usuario existe
        const user = await Usuario.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Jugador no encontrado.' });
        }

        let objeto = null;
        let tipoObjeto = '';

        try {
            [objeto, tipoObjeto] = await Promise.any([
                Weapon.findOne({ name: nombreObjeto }).then(obj => obj ? [obj, 'Weapon'] : Promise.reject()),
                Armor.findOne({ name: nombreObjeto }).then(obj => obj ? [obj, 'Armor'] : Promise.reject()),
                Item.findOne({ name: nombreObjeto }).then(obj => obj ? [obj, 'Item'] : Promise.reject())
            ]);
        } catch (error) {
            // Si no se encuentra el objeto en ninguna de las colecciones
            return res.status(404).json({ error: 'Objeto no encontrado.' });
        }

        // Agrega el objeto al inventario del usuario
        user.inventario.push({
            _id: new mongoose.Types.ObjectId(),
            objetoId: objeto._id,
            refPath: tipoObjeto,  // Indica el tipo de objeto (Weapon, Armor, Item)
            active: true // El estado por defecto es activo, pero puedes modificarlo si lo deseas
        });

        // Guarda el usuario con el nuevo objeto en el inventario
        await user.save();

        res.status(200).json({ message: 'Objeto agregado al inventario exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

// Ruta para transferir un objeto de inventario a inventario_juego
router.post('/transfer', async (req, res) => {
    const { userId, IdObjeto } = req.body;

    try {
        // Verifica si el usuario existe
        const user = await Usuario.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Jugador no encontrado.' });
        }

        // Encuentra el objeto en el inventario usando el _id
        const objetoIndex = user.inventario.findIndex(item => item._id.toString() === IdObjeto);

        if (objetoIndex === -1) {
            return res.status(404).json({ error: 'Objeto no encontrado en el inventario.' });
        }

        const objeto = user.inventario[objetoIndex];

        // Verifica si el objeto está activo
        if (!objeto.active) {
            return res.status(400).json({ error: 'El objeto no está activo y no puede ser transferido.' });
        }

        // Elimina el objeto del inventario
        user.inventario.splice(objetoIndex, 1);

        // Agrega el objeto a inventario_juego
        user.inventario_juego.push({
            _id: objeto._id,
            objetoId: objeto.objetoId,
            refPath: objeto.refPath,
            active: objeto.active
        });

        // Guarda los cambios en la base de datos
        await user.save();

        res.status(200).json({ message: 'Objeto transferido al inventario de juego exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

module.exports = router;