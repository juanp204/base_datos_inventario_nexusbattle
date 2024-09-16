const express = require('express');
const router = express.Router();
const Usuario = require('../../modelos/usuarios'); // Asegúrate de tener la ruta correcta al modelo

// Endpoint para intercambiar objetos entre jugadores
router.post('/transfer-object', async (req, res) => {
    const { fromUserId, toUserId, objetoId } = req.body;

    try {
        // Verifica si ambos usuarios existen
        const fromUser = await Usuario.findById(fromUserId);
        const toUser = await Usuario.findById(toUserId);

        if (!fromUser || !toUser) {
            return res.status(404).json({ error: 'Uno o ambos jugadores no existen.' });
        }

        // Verifica si el objeto está en el inventario del jugador que lo está transfiriendo
        const objectIndex = fromUser.inventario.findIndex(obj => obj._id.equals(objetoId) && obj.active === false);
        if (objectIndex === -1) {
            return res.status(400).json({ error: 'El objeto no está en el inventario del jugador o está activo.' });
        }

        // Obtén el objeto a transferir
        const objeto = fromUser.inventario[objectIndex];

        // Elimina el objeto del inventario del jugador que lo transfiere
        fromUser.inventario.splice(objectIndex, 1);

        // Agrega el objeto al inventario del jugador receptor
        toUser.inventario.push(objeto);

        // Guarda los cambios en la base de datos
        await fromUser.save();
        await toUser.save();

        res.status(200).json({ message: 'El objeto ha sido transferido exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});


router.get('/inventory/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Verifica si el usuario existe
        const user = await Usuario.findById(userId)
            .populate({
                path: 'inventario.objetoId'  // Ajusta los campos que quieres devolver según tu esquema de objetos
            })
            .populate({
                path: 'inventario_juego.objetoId'// Ajusta los campos que quieres devolver según tu esquema de objetos
            })
            .select('inventario inventario_juego');

        if (!user) {
            return res.status(404).json({ error: 'Jugador no encontrado.' });
        }

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

// Endpoint para desactivar un objeto del inventario
router.patch('/inventory/deactivate/:userId/:objetoId', async (req, res) => {
    const { userId, objetoId } = req.params;

    try {
        // Verifica si el usuario existe
        const user = await Usuario.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Jugador no encontrado.' });
        }

        // Encuentra el objeto en el inventario del jugador
        const itemIndex = user.inventario.findIndex(obj => obj.objetoId.equals(objetoId));
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Objeto no encontrado en el inventario del jugador.' });
        }

        // Cambia el estado del objeto a 'active = false'
        user.inventario[itemIndex].active = false;

        // Guarda los cambios en la base de datos
        await user.save();

        res.status(200).json({ message: 'Objeto desactivado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

// Endpoint para activar un objeto del inventario
router.patch('/inventory/activate/:userId/:objetoId', async (req, res) => {
    const { userId, objetoId } = req.params;

    try {
        // Verifica si el usuario existe
        const user = await Usuario.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Jugador no encontrado.' });
        }

        // Encuentra el objeto en el inventario del jugador
        const itemIndex = user.inventario.findIndex(obj => obj.objetoId.equals(objetoId));
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Objeto no encontrado en el inventario del jugador.' });
        }

        // Cambia el estado del objeto a 'active = true'
        user.inventario[itemIndex].active = true;

        // Guarda los cambios en la base de datos
        await user.save();

        res.status(200).json({ message: 'Objeto activado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

module.exports = router;
