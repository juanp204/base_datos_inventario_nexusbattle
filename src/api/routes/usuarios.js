// routes/usuarios.js
const express = require('express');
const router = express.Router();
const Usuario = require('../../modelos/usuarios');

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        await console.log(usuarios)
        res.status(200).json(usuarios);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(200).json(usuario);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Actualizar un usuario por ID
/* router.put('/:id', async (req, res) => {
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(200).json(usuarioActualizado);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}); */

// Eliminar un usuario por ID
router.delete('/:id', async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
