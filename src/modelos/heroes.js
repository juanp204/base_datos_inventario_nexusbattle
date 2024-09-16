const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { Objeto, effectSchema } = require('./objetos');

const skillSchema = new Schema({
    name: { type: String, required: true },
    levelRequired: { type: Number, required: true },
    powerCost: { type: Number, required: true },
    effects: [{ type: effectSchema, required: true }],
})

const heroeSchema = new Schema({
    name: { type: String, required: true },  // Nombre del héroe
    type: { type: String, required: true, enum: ["Guerrero", "Mago", "Picaro"] },  // Clase del héroe
    attributes: {
        power: { type: Number, required: true },
        health: { type: Number, required: true },
        defense: { type: Number, required: true },
        attack: [{ type: Number, required: true }, { type: Number, required: true }],  // Array con [daño base, dado]
        damage: { type: Number, required: true }
    },
    skills: [
        { type: skillSchema, required: true }
    ],
    specialAbilities: [
        { type: Schema.Types.ObjectId, ref: 'Ability', required: false }
    ] // Referencia a habilidades específicas
});

// Validación personalizada para asegurarse de que `specialAbilities` solo contiene habilidades
/* heroeSchema.path('specialAbilities').validate(async function (specialAbilities) {
    // Buscar todos los objetos referenciados en `specialAbilities`
    try {
        const abilities = await Objeto.find({ _id: { $in: specialAbilities } });

        // Verificar que todos los objetos sean de tipo 'habilidad'
        return abilities.every(ability => ability.type === 'habilidad');
    } catch (error) {

    }
}, 'Todas las habilidades especiales deben ser de tipo "habilidad".'); */

// Crear el modelo 'Heroe'
const Heroe = model('Heroe', heroeSchema);

module.exports = Heroe;
