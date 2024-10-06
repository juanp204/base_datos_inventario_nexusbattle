const express = require('express');
const router = express.Router();
const Usuario = require('../../modelos/usuarios'); // Asegúrate de tener la ruta correcta al modelo

// Endpoint para intercambiar objetos entre jugadores
router.post('/transfer-object', async (req, res) => {
    const { fromUser, toUser, objetoId } = req.body; // Cambiado de fromUserId y toUserId a fromUser y toUser

    try {
        // Verifica si ambos usuarios existen utilizando el campo 'user'
        const fromUserData = await Usuario.findOne({ user: fromUser });
        const toUserData = await Usuario.findOne({ user: toUser });

        if (!fromUserData || !toUserData) {
            return res.status(404).json({ error: 'Uno o ambos jugadores no existen.' });
        }

        // Verifica si el objeto está en el inventario del jugador que lo está transfiriendo
        const objectIndex = fromUserData.inventario.findIndex(obj => obj._id.equals(objetoId) && obj.active === false);
        if (objectIndex === -1) {
            return res.status(400).json({ error: 'El objeto no está en el inventario del jugador o está activo.' });
        }

        // Obtén el objeto a transferir
        const objeto = fromUserData.inventario[objectIndex];

        // Elimina el objeto del inventario del jugador que lo transfiere
        fromUserData.inventario.splice(objectIndex, 1);

        // Agrega el objeto al inventario del jugador receptor
        toUserData.inventario.push(objeto);

        // Guarda los cambios en la base de datos
        await fromUserData.save();
        await toUserData.save();

        res.status(200).json({ message: 'El objeto ha sido transferido exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

// Endpoint para desactivar un objeto del inventario
router.patch('/deactivateObject/:user/:objetoId', async (req, res) => {
    const { user, objetoId } = req.params; // Cambiado de userId a user

    try {
        // Verifica si el usuario existe utilizando el campo 'user'
        const userData = await Usuario.findOne({ user });
        if (!userData) {
            return res.status(404).json({ error: 'Jugador no encontrado.' });
        }

        // Encuentra el objeto en el inventario del jugador
        const itemIndex = userData.inventario.findIndex(obj => obj.objetoId.equals(objetoId));
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Objeto no encontrado en el inventario del jugador.' });
        }

        // Cambia el estado del objeto a 'active = false'
        userData.inventario[itemIndex].active = false;

        // Guarda los cambios en la base de datos
        await userData.save();

        res.status(200).json({ message: 'Objeto desactivado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

// Endpoint para activar un objeto del inventario
router.patch('/activateObject/:user/:objetoId', async (req, res) => {
    const { user, objetoId } = req.params; // Cambiado de userId a user

    try {
        // Verifica si el usuario existe utilizando el campo 'user'
        const userData = await Usuario.findOne({ user });
        if (!userData) {
            return res.status(404).json({ error: 'Jugador no encontrado.' });
        }

        // Encuentra el objeto en el inventario del jugador
        const itemIndex = userData.inventario.findIndex(obj => obj.objetoId.equals(objetoId));
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Objeto no encontrado en el inventario del jugador.' });
        }

        // Cambia el estado del objeto a 'active = true'
        userData.inventario[itemIndex].active = true;

        // Guarda los cambios en la base de datos
        await userData.save();

        res.status(200).json({ message: 'Objeto activado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

module.exports = router;
