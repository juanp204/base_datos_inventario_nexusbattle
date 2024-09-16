const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Usuario = require('../../modelos/usuarios'); // Asegúrate de tener la ruta correcta al modelo
const { Weapon, Armor, Item } = require('../../modelos/objetos'); // Modelo de Objetos

// Enpoint obtener el inventario del usuario
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

router.post('/inventory/add', async (req, res) => {
    const { userId, nombreObjeto } = req.body;

    try {
        // Verifica si el usuario existe
        const user = await Usuario.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Jugador no encontrado.' });
        }

        let objeto = null;
        let tipoObjeto = '';

        // Intenta encontrar el objeto en las colecciones de Weapon, Armor, o Item
        try {
            [objeto, tipoObjeto] = await Promise.any([
                Weapon.findOne({ nombre: nombreObjeto }).then(obj => obj ? [obj, 'Weapon'] : Promise.reject()),
                Armor.findOne({ nombre: nombreObjeto }).then(obj => obj ? [obj, 'Armor'] : Promise.reject()),
                Item.findOne({ nombre: nombreObjeto }).then(obj => obj ? [obj, 'Item'] : Promise.reject())
            ]);

            // Si encuentra el objeto, lo retorna junto con su tipo
        } catch (error) {
            // Si no se encuentra el objeto en ninguna de las colecciones
            return res.status(404).json({ error: 'Objeto no encontrado.' });
        }


        // Agrega el objeto al inventario del usuario
        user.inventario.push({
            _id: mongoose.Types.ObjectId(),
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

module.exports = router;