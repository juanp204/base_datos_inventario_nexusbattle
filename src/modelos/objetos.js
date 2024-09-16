const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const effectSchema = new Schema({
    attackBoost: { number: { type: Number }, random: { type: Number }, turn_effect: { type: Number } },
    damageBoost: { number: { type: Number }, random: { type: Number }, turn_effect: { type: Number } },
    criticBoost: { number: { type: Number }, random: { type: Number }, turn_effect: { type: Number } },
    magic_damage: { number: { type: Number }, random: { type: Number }, turn_effect: { type: Number } },
    healthBoost: { number: { type: Number }, random: { type: Number }, turn_effect: { type: Number } },
    recover_health: { number: { type: Number }, random: { type: Number }, turn_effect: { type: Number } },
    defenseBoost: { number: { type: Number }, random: { type: Number }, turn_effect: { type: Number } },
    oponent_power: { number: { type: Number }, random: { type: Number }, turn_effect: { type: Number } },
    oponent_attack: { number: { type: Number }, random: { type: Number }, turn_effect: { type: Number } },
    oponent_damage: { number: { type: Number }, random: { type: Number }, turn_effect: { type: Number } },
    oponent_critical_damage: { number: { type: Number }, random: { type: Number }, turn_effect: { type: Number } },
    multiply_object_effect: {
        object: { type: Schema.Types.ObjectId, ref: 'Weapon' },
        effect: { type: Number } // Define el tipo de efecto según sea necesario
    },
    return_damage: { number: { type: Schema.Types.Mixed }, random: { type: Schema.Types.Mixed }, turn_effect: { type: Number } },
    ignore_physic_atack: { boolean: { type: Boolean }, turn_effect: { type: Number } },
});

const objetoSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["arma", "pecho", "guantes", "casco", "zapatos", "brazaletes", "pantalon", "item", "habilidad"] },
    heroe_type: { type: Schema.Types.ObjectId, ref: 'Heroe', required: true },
    effects: { type: effectSchema, required: true },
    dropRate: { type: Number, required: true }, // Probabilidad de obtener el objeto tras una batalla
    interaction: [{ type: effectSchema }] // Define el campo como una lista de interacciones
});

const Item = model('Item', objetoSchema);
const Weapon = model('Weapon', objetoSchema);
const Armor = model('Armor', objetoSchema);
const Ability = model('Ability', objetoSchema);

module.exports = { Item, Weapon, Armor, Ability, effectSchema };


