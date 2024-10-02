const mongoose = require('mongoose');
const Heroe = require('./modelos/heroes');
const { Weapon, Armor, Item, Ability } = require('./modelos/objetos'); // Asegúrate de exportar Weapon correctamente
const Usuario = require('./modelos/usuarios');
mongoose.set('bufferCommands', false);

async function obtenerIdHeroePorNombre(nombre) {
    try {
        const heroe = await Heroe.findOne({ name: nombre }).exec();
        if (heroe) {
            return heroe._id;
        } else {
            throw new Error('Héroe no encontrado ', nombre);
        }
    } catch (error) {
        console.error('Error al obtener el ID del héroe:', error, nombre);

        return null;
    }
}

async function obtenerIdWeaponPorNombre(nombre) {
    try {
        const heroe = await Weapon.findOne({ name: nombre }).exec();
        if (heroe) {
            return heroe._id;
        } else {
            throw new Error('weapon no encontrado', nombre);
        }
    } catch (error) {
        console.error('Error al obtener el ID del weapon:', error, nombre);
        return null;
    }
}

async function insertarHeroes() {
    try {
        await conectarBaseDatos();
        const heroes = [
            {
                name: 'Guerrero Tanque',
                type: 'Guerrero',
                attributes: {
                    power: 10,
                    health: 44,
                    defense: 11,
                    attack: [10, 6], // 10 + 1d6
                    damage: 4 // 1d4
                },
                skills: [
                    {
                        name: 'Golpe con escudo',
                        levelRequired: 2,
                        powerCost: 2,
                        effects: [
                            { attackBoost: { number: 2, turn_effect: 1 } }
                        ]
                    },
                    {
                        name: 'Mano de piedra',
                        levelRequired: 5,
                        powerCost: 4,
                        effects: [
                            { defenseBoost: { number: 12, turn_effect: 1 } }
                        ]
                    },
                    {
                        name: 'Defensa feroz',
                        levelRequired: 8,
                        powerCost: 6,
                        effects: [
                            { ignore_physic_atack: { boolean: true, turn_effect: 1 } },
                            { magic_damage: { random: 18, turn_effect: 1 } }
                        ]
                    }
                ],
                specialAbilities: [],
                image: 'Heroes/BarbaroTanque.png' // Associated image
            },
            {
                name: 'Guerrero Armas',
                type: 'Guerrero',
                attributes: {
                    power: 8,
                    health: 44,
                    defense: 11,
                    attack: [10, 6], // 10 + 1d6
                    damage: 4 // 1d4
                },
                skills: [
                    {
                        name: 'Embate sangriento',
                        levelRequired: 2,
                        powerCost: 4,
                        effects: [
                            { attackBoost: { number: 2, turn_effect: 1 } },
                            { damageBoost: { number: 1, turn_effect: 1 } }
                        ]
                    },
                    {
                        name: 'Lanza de los dioses',
                        levelRequired: 5,
                        powerCost: 4,
                        effects: [
                            { damageBoost: { number: 2, turn_effect: 1 } }
                        ]
                    },
                    {
                        name: 'Golpe de tormenta',
                        levelRequired: 8,
                        powerCost: 6,
                        effects: [
                            { damageBoost: { number: 2, turn_effect: 1 } },
                            { attackBoost: { random: 18, turn_effect: 1 } }
                        ]
                    }
                ],
                specialAbilities: [],
                image: 'Heroes/Barbaro.png' // Associated image
            },
            {
                name: 'Mago Fuego',
                type: 'Mago',
                attributes: {
                    power: 8,
                    health: 40,
                    defense: 10,
                    attack: [10, 8], // 10 + 1d8
                    damage: 6 // 1d6
                },
                skills: [
                    {
                        name: 'Misiles de magma',
                        levelRequired: 2,
                        powerCost: 2,
                        effects: [
                            { attackBoost: { number: 1, turn_effect: 1 } },
                            { damageBoost: { number: 2, turn_effect: 1 } }
                        ]
                    },
                    {
                        name: 'Vulcano',
                        levelRequired: 5,
                        powerCost: 6,
                        effects: [
                            { attackBoost: { number: 3, turn_effect: 1 } },
                            { damageBoost: { random: 27, turn_effect: 1 } }
                        ]
                    },
                    {
                        name: 'Pare de fuego',
                        levelRequired: 8,
                        powerCost: 4,
                        effects: [
                            { attackBoost: { number: 1, turn_effect: 1 } },
                            { return_damage: { random: "x", turn_effect: 1 } }
                        ]
                    }
                ],
                specialAbilities: [],
                image: 'Heroes/MagoFuego.png' // Associated image
            },
            {
                name: 'Mago Hielo',
                type: 'Mago',
                attributes: {
                    power: 10,
                    health: 40,
                    defense: 10,
                    attack: [10, 8], // 10 + 1d8
                    damage: 6 // 1d6
                },
                skills: [
                    {
                        name: 'Lluvia de hielo',
                        levelRequired: 2,
                        powerCost: 2,
                        effects: [
                            { attackBoost: { number: 2, turn_effect: 1 } },
                            { damageBoost: { number: 2, turn_effect: 1 } }
                        ]
                    },
                    {
                        name: 'Cono de hielo',
                        levelRequired: 5,
                        powerCost: 6,
                        effects: [
                            { damageBoost: { number: 2, turn_effect: 1 } },
                            { oponent_attack: { random: 3, turn_effect: 2 } }
                        ]
                    },
                    {
                        name: 'Bola de hielo',
                        levelRequired: 8,
                        powerCost: 4,
                        effects: [
                            { attackBoost: { number: 2, turn_effect: 1 } },
                            { oponent_damage: { number: 4, turn_effect: 1 } }
                        ]
                    }
                ],
                specialAbilities: [],
                image: 'Heroes/MagoHielo.png' // Associated image
            },
            {
                name: 'Pícaro Veneno',
                type: 'Picaro',
                attributes: {
                    power: 8,
                    health: 36,
                    defense: 8,
                    attack: [10, 10], // 10 + 1d10
                    damage: 8 // 1d8
                },
                skills: [
                    {
                        name: 'Flor de loto',
                        levelRequired: 2,
                        powerCost: 2,
                        effects: [
                            { damageBoost: { random: 32, turn_effect: 1 } }
                        ]
                    },
                    {
                        name: 'Agonía',
                        levelRequired: 5,
                        powerCost: 4,
                        effects: [
                            { damageBoost: { random: 18, turn_effect: 1 } }
                        ]
                    },
                    {
                        name: 'Piquete',
                        levelRequired: 8,
                        powerCost: 4,
                        effects: [
                            { attackBoost: { number: 1, turn_effect: 2 } },
                            { damageBoost: { number: 2, turn_effect: 1 } }
                        ]
                    }
                ],
                specialAbilities: [],
                image: 'Heroes/PicaroVeneno.png' // Associated image
            },
            {
                name: 'Pícaro Machete',
                type: 'Picaro',
                attributes: {
                    power: 8,
                    health: 36,
                    defense: 8,
                    attack: [10, 10], // 10 + 1d10
                    damage: 8 // 1d8
                },
                skills: [
                    {
                        name: 'Cortada',
                        levelRequired: 2,
                        powerCost: 2,
                        effects: [
                            { damageBoost: { number: 2, turn_effect: 2 } }
                        ]
                    },
                    {
                        name: 'Machetazo',
                        levelRequired: 5,
                        powerCost: 4,
                        effects: [
                            { damageBoost: { random: 16, turn_effect: 1 } },
                            { attackBoost: { random: 1, turn_effect: 1 } }
                        ]
                    },
                    {
                        name: 'Planazo',
                        levelRequired: 8,
                        powerCost: 4,
                        effects: [
                            { attackBoost: { random: 16, turn_effect: 1 } },
                            { damageBoost: { number: 1, turn_effect: 1 } }
                        ]
                    }
                ],
                specialAbilities: [],
                image: 'Heroes/PicaroMachete.png' // Associated image
            }
        ];

        await Heroe.insertMany(heroes);
        console.log('Héroes insertados correctamente');
    } catch (error) {
        console.error('Error al insertar héroes:', error);
    } finally {
        await cerrarBaseDatos();
    }
}

async function insertarWeapons() {
    try {
        await conectarBaseDatos();


        const idGuerreroTanque = await obtenerIdHeroePorNombre('Guerrero Tanque');
        const idGuerreroArmas = await obtenerIdHeroePorNombre('Guerrero Armas');
        const idMagoFuego = await obtenerIdHeroePorNombre('Mago Fuego');
        const idMagoHielo = await obtenerIdHeroePorNombre('Mago Hielo');
        const idPicaroVeneno = await obtenerIdHeroePorNombre('Pícaro Veneno');
        const idPicaroMachete = await obtenerIdHeroePorNombre('Pícaro Machete');

        const weapons = [
            {
                name: "Espada de una mano",
                image: "/Armas/EspadaDeUnaMano.png",
                type: "arma",
                heroe_type: idGuerreroTanque,
                effects: {
                    attackBoost: { number: 1, turn_effect: 1 },
                    criticBoost: { number: 1, turn_effect: 1 }
                },
                dropRate: 3
            },
            {
                name: "Espada de dos manos",
                image: "/Armas/EspadaDeDosManos.png",
                type: "arma",
                heroe_type: idGuerreroArmas,
                effects: {
                    attackBoost: { number: 1, turn_effect: 1 },
                    criticBoost: { number: 3, turn_effect: 1 }
                },
                dropRate: 1
            },
            {
                name: "Orbe de manos ardientes",
                image: "/Armas/OrbeDeManosArdiente.png",
                type: "arma",
                heroe_type: idMagoFuego,
                effects: {
                    damageBoost: { number: 1, turn_effect: 1 },
                    criticBoost: { number: 3, turn_effect: 1 }
                },
                dropRate: 1
            },
            {
                name: "Báculo de Permafrost",
                image: "/Armas/BaculoDePermafrost.png",
                type: "arma",
                heroe_type: idMagoHielo,
                effects: {
                    oponent_damage: { number: -1, turn_effect: 1 },
                    oponent_critical_damage: { number: -2, turn_effect: 1 }
                },
                dropRate: 10
            },
            {
                name: "Daga purulenta",
                image: "/Armas/DagaPurulenta.png",
                type: "arma",
                heroe_type: idPicaroVeneno,
                effects: {
                    damageBoost: { number: 1, turn_effect: 2 },
                    criticBoost: { number: 3, turn_effect: 1 }
                },
                dropRate: 10
            },
            {
                name: "Machete bendito",
                image: "/Armas/MacheteBendito.png",
                type: "arma",
                heroe_type: idPicaroMachete,
                effects: {
                    damageBoost: { number: 2, turn_effect: 1 },
                    criticBoost: { number: 2, turn_effect: 1 }
                },
                dropRate: 10
            },
            {
                name: "Escudo de dragón",
                image: "/Armas/EscudoDeDragon.png",
                type: "arma",
                heroe_type: idGuerreroTanque,
                effects: {
                    defenseBoost: { number: 1, turn_effect: 1 }
                },
                dropRate: 5
            },
            {
                name: "Piedra de afilar",
                image: "/Armas/PiedraDeAfilar.png",
                type: "arma",
                heroe_type: idGuerreroArmas,
                effects: {
                    damageBoost: { number: 2, turn_effect: 1 }
                },
                dropRate: 2
            },
            {
                name: "Fuego fatuo",
                image: "/Armas/FuegoFatuo.png",
                type: "arma",
                heroe_type: idMagoFuego,
                effects: {
                    attackBoost: { number: 1, turn_effect: 1 }
                },
                dropRate: 3
            },
            {
                name: "Venas heladas",
                image: "/Armas/VenasHeladas.png",
                type: "arma",
                heroe_type: idMagoHielo,
                effects: {
                    damageBoost: { number: 1, turn_effect: 1 }
                },
                dropRate: 5
            },
            {
                name: "Visión borrosa",
                image: "/Armas/VisionBorrosa.png",
                type: "arma",
                heroe_type: idPicaroVeneno,
                effects: {
                    oponent_attack: { number: -1, turn_effect: 1 }
                },
                dropRate: 4
            },
            {
                name: "Sierra sangrienta",
                image: "/Armas/SierraSangrienta.png",
                type: "arma",
                heroe_type: idPicaroMachete,
                effects: {
                    damageBoost: { number: 2, turn_effect: 1 }
                },
                dropRate: 10
            }
        ];

        // Inserta las armas en la base de datos
        await Weapon.insertMany(weapons);
        console.log('Armas insertadas correctamente');
    } catch (error) {
        console.error('Error al insertar armas:', error);
    } finally {
        await cerrarBaseDatos();
    }
}

async function insertarArmors() {
    try {
        await conectarBaseDatos();

        const idGuerreroTanque = await obtenerIdHeroePorNombre('Guerrero Tanque');
        const idGuerreroArmas = await obtenerIdHeroePorNombre('Guerrero Armas');
        const idMagoFuego = await obtenerIdHeroePorNombre('Mago Fuego');
        const idMagoHielo = await obtenerIdHeroePorNombre('Mago Hielo');
        const idPicaroVeneno = await obtenerIdHeroePorNombre('Pícaro Veneno');
        const idPicaroMachete = await obtenerIdHeroePorNombre('Pícaro Machete');

        const Armors = [
            {
                name: "Defensa del enfurecido",
                image: "/Armaduras/DefensaDelEnfurecido.png",
                type: "pecho",
                heroe_type: idGuerreroTanque,
                effects: {
                    defenseBoost: { number: 2, turn_effect: 1 },
                    healthBoost: { number: 2, turn_effect: 1 }
                },
                dropRate: 5,
                interaction: []
            },
            {
                name: "Puño lúcido",
                image: "/Armaduras/PunoLucido.png",
                type: "guantes",
                heroe_type: idGuerreroArmas,
                effects: {
                    defenseBoost: { number: 2, turn_effect: 1 },
                    healthBoost: { number: 1, turn_effect: 1 }
                },
                dropRate: 2,
                interaction: []
            },
            {
                name: "Túnica arcana",
                image: "/Armaduras/TunicaArcana.png",
                type: "pecho",
                heroe_type: idMagoFuego,
                effects: {
                    defenseBoost: { number: 2, turn_effect: 1 },
                    healthBoost: { number: 1, turn_effect: 1 }
                },
                dropRate: 3,
                interaction: []
            },
            {
                name: "Corona de hielo",
                image: "/Armaduras/CoronaDeHielo.png",
                type: "casco",
                heroe_type: idMagoHielo,
                effects: {
                    defenseBoost: { number: 1, turn_effect: 1 },
                    healthBoost: { number: 1, turn_effect: 1 }
                },
                dropRate: 5,
                interaction: []
            },
            {
                name: "Mano del desterrado",
                image: "/Armaduras/ManoDelDesterrado.png",
                type: "guantes",
                heroe_type: idPicaroVeneno,
                effects: {
                    defenseBoost: { number: 2, turn_effect: 1 },
                    healthBoost: { number: 1, turn_effect: 1 }
                },
                dropRate: 4,
                interaction: []
            },
            {
                name: "Pie de atleta",
                image: "/Armaduras/PieDeAtleta.png",
                type: "zapatos",
                heroe_type: idPicaroMachete,
                effects: {
                    defenseBoost: { number: 2, turn_effect: 1 },
                    healthBoost: { number: 1, turn_effect: 1 }
                },
                dropRate: 1,
                interaction: []
            },
            {
                name: "Magma Ardiente",
                image: "/Armaduras/MagmaArdiente.png",
                type: "casco",
                heroe_type: idGuerreroTanque,
                effects: {
                    defenseBoost: { number: 2, turn_effect: 1 },
                    healthBoost: { number: 1, turn_effect: 1 }
                },
                dropRate: 5,
                interaction: []
            },
            {
                name: "Puños en llamas",
                image: "/Armaduras/PunosEnLlamas.png",
                type: "brazaletes",
                heroe_type: idGuerreroArmas,
                effects: {
                    defenseBoost: { number: 1, turn_effect: 1 },
                    recover_health: { number: 1, turn_effect: 1 }
                },
                dropRate: 2,
                interaction: []
            },
            {
                name: "Caída de fuego",
                image: "/Armaduras/CaidaDeFuego.png",
                type: "pantalon",
                heroe_type: idMagoFuego,
                effects: {
                    defenseBoost: { number: 1, turn_effect: 1 },
                    magic_damage: { number: 1, turn_effect: 1 }
                },
                dropRate: 3,
                interaction: []
            },
            {
                name: "Ventisca",
                image: "/Armaduras/Ventisca.png",
                type: "pecho",
                heroe_type: idMagoHielo,
                effects: {
                    defenseBoost: { number: 1, turn_effect: 1 },
                    healthBoost: { number: 2, turn_effect: 1 }
                },
                dropRate: 5,
                interaction: []
            },
            {
                name: "Atadura carmesí",
                image: "/Armaduras/AtaduraCarmesi.png",
                type: "pecho",
                heroe_type: idPicaroVeneno,
                effects: {
                    defenseBoost: { number: 1, turn_effect: 1 },
                    healthBoost: { number: 2, turn_effect: 1 }
                },
                dropRate: 4,
                interaction: []
            },
            {
                name: "Sangre cruel",
                image: "/Armaduras/SangreCruel.png",
                type: "brazaletes",
                heroe_type: idPicaroMachete,
                effects: {
                    defenseBoost: { number: 1, turn_effect: 1 },
                    healthBoost: { number: 1, turn_effect: 1 }
                },
                dropRate: 1,
                interaction: []
            }
        ];


        // Inserta las armas en la base de datos
        await Armor.insertMany(Armors);
        console.log('Armas insertadas correctamente');
    } catch (error) {
        console.error('Error al insertar armas:', error);
    } finally {
        await cerrarBaseDatos();
    }
}

async function insertarItems() {
    try {
        await conectarBaseDatos();

        const idGuerreroTanque = await obtenerIdHeroePorNombre('Guerrero Tanque');
        const idGuerreroArmas = await obtenerIdHeroePorNombre('Guerrero Armas');
        const idMagoFuego = await obtenerIdHeroePorNombre('Mago Fuego');
        const idMagoHielo = await obtenerIdHeroePorNombre('Mago Hielo');
        const idPicaroVeneno = await obtenerIdHeroePorNombre('Pícaro Veneno');
        const idPicaroMachete = await obtenerIdHeroePorNombre('Pícaro Machete');
        const idcierra = await obtenerIdWeaponPorNombre('Sierra sangrienta');

        const Items = [
            {
                name: "Pinchos de escudo",
                image: 'items/PinchosDeEscudo.png', // Associated image
                type: "item",
                heroe_type: idGuerreroTanque,
                effects: {
                    return_damage: { number: 1, turn_effect: 1 }
                },
                dropRate: 20,
                interaction: []
            },
            {
                name: "Empuñadura de Furia",
                image: 'items/EmpunaduraDeFuria.png', // Associated image
                type: "item",
                heroe_type: idGuerreroArmas,
                effects: {
                    damageBoost: { number: 1, turn_effect: 2 },
                    healthBoost: { number: -1, turn_effect: 2 }
                },
                dropRate: 10,
                interaction: []
            },
            {
                name: "Anillo para Piro-explosión",
                image: 'items/AnilloParaPiro-Explosion.png', // Associated image
                type: "item",
                heroe_type: idMagoFuego,
                effects: {
                    damageBoost: { number: 3, turn_effect: 1 }
                },
                dropRate: 7,
                interaction: []
            },
            {
                name: "Libro de la ventisca helada",
                image: 'items/LibroDeLaVentiscaHelada.png', // Associated image
                type: "item",
                heroe_type: idMagoHielo,
                effects: {
                    damageBoost: { number: 2, turn_effect: 1 }
                },
                dropRate: 10,
                interaction: []
            },
            {
                name: "Veneno lacerante",
                image: 'items/VenenoLacerante.png', // Associated image
                type: "item",
                heroe_type: idPicaroVeneno,
                effects: {
                    oponent_power: { number: -1, turn_effect: 2 }
                },
                dropRate: 9,
                interaction: []
            },
            {
                name: "Mancuerna yugular",
                image: 'items/MancuernaYugular.png', // Associated image
                type: "item",
                heroe_type: idPicaroMachete,
                effects: {
                    multiply_object_effect: { effect: 2, object: idcierra }
                },
                dropRate: 8,
                interaction: []
            }
        ];

        // Inserta las armas en la base de datos
        await Item.insertMany(Items);
        console.log('items insertadas correctamente');
    } catch (error) {
        console.error('Error al insertar items:', error);
    } finally {
        await cerrarBaseDatos();
    }
}

async function conectarBaseDatos() {
    try {
        await mongoose.connect('mongodb+srv://Inventario:uFjKb8eSam571X8u@cluster0.kxdmz.mongodb.net/Inventario?retryWrites=true&w=majority&appName=Cluster0', {
            autoIndex: true
        });
        console.log('Conexión a MongoDB establecida correctamente');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1); // Sale si no puede conectar a la base de datos
    }
}

async function cerrarBaseDatos() {
    try {
        await mongoose.connection.close();
        console.log('Conexión a MongoDB cerrada');
    } catch (error) {
        console.error('Error al cerrar la conexión a MongoDB:', error);
    }
}

async function insertarUserPrueba() {
    try {
        await conectarBaseDatos();
        //const user = [{ user: "juan" }];

        const nuevoUsuario = new Usuario({
            user: 'usuario1' // Inventario vacío
        });

        //await Heroe.insertMany(heroes);
        await nuevoUsuario.save();

        console.log('usuario insertados correctamente');
    } catch (error) {
        console.error('Error al insertar héroes:', error);
    } finally {
        await cerrarBaseDatos();
    }
}

(async () => {
    await insertarHeroes();
    await insertarWeapons();
    await insertarArmors();
    await insertarItems();
    await insertarUserPrueba();
})();


