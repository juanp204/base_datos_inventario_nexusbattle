const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const usuarioSchema = new Schema({
    user: { type: String, required: true },
    heroes: [{
        heroe: { type: Schema.Types.ObjectId, ref: 'Heroe' },
        level: { type: Number, default: 1 },
        equippedItems: {
            weapon: [{ type: Schema.Types.ObjectId, ref: 'Weapon' }],
            armor: [{ type: Schema.Types.ObjectId, ref: 'Armor' }],
            items: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
        },
    }],  // Referencia a Héroes
    inventario: [{
        _id: { type: Schema.Types.ObjectId, required: true },
        objetoId: { type: Schema.Types.ObjectId, required: true, refPath: 'inventario.refPath' },  // Puedes usar cualquier nombre en lugar de _id
        refPath: { type: String, required: true, enum: ['Weapon', 'Armor', 'Item'] },  // Tipo de objeto
        active: { type: Boolean, default: true }
    }],  // Inventario sin límite
    inventario_juego: [{
        _id: { type: Schema.Types.ObjectId, required: true },
        objetoId: { type: Schema.Types.ObjectId, required: true, refPath: 'inventario_juego.refPath' },  // Puedes usar cualquier nombre en lugar de _id
        refPath: { type: String, required: true, enum: ['Weapon', 'Armor', 'Item'] },  // Tipo de objeto
        active: { type: Boolean, default: true }  // Si no usas refPath, debes poner "ref" en cada campo donde corresponda
    }]  // Inventario con límite
});

// Validación personalizada para limitar el número de objetos en 'inventario_juego'
usuarioSchema.path('inventario_juego').validate(function (value) {
    return value.length <= 10;  // Limita a 10 objetos
}, 'El inventario de juego no puede tener más de 10 objetos.');

// Crear el modelo 'Usuario'
const Usuario = model('Usuario', usuarioSchema);

module.exports = Usuario;
