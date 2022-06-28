const { Client, Intents, MessageEmbed, MessageFlags, MessageManager, Message, MessageReaction } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const config = require("./config.json");
const sqlite = require('sqlite3').verbose();
const { PythonShell } = require('python-shell');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    let db = new sqlite.Database('./asd.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
    db.run(`CREATE TABLE IF NOT EXISTS data(userid INTEGER NOT NULL, username TEXT, dinero TEXT, dineroBanco INTEGER, trabajo INTEGER, cuchillo INTEGER, bici INTEGER, camion INTEGER, nuevemm INTEGER, nuevemmBalas INTEGER, revolver INTEGER, revolverBalas INTEGER, m16 INTEGER, m16Balas INTEGER, ak47 INTEGER, ak47Balas INTEGER, carabina INTEGER, carabinaBalas INTEGER,licenciaarmas INTEGER, color INTEGER, pais INTEGER, edad INTEGER, expTaxista INTEGER, expCamionero INTEGER)`);
});

const tiempoTrabajo = new Set();

client.on('messageCreate', message => {
    if (message.content === 'ping') { message.channel.send('pong'); }
    let userid = message.author.id;
    if (message.author.bot) return;
    let db = new sqlite.Database('./asd.db', sqlite.OPEN_READWRITE);
    let prefix = "$"

    const args = message.content.trim().split(/ +/g);
    const cmd = args[0].slice(prefix.length).toLowerCase();

    if (cmd === "est") {
        db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
            if (!row) return message.channel.send("No existes, usa /empezar");
            if (args[1]) return message.channel.send("Sin tag.");
            let avatar = message.author.displayAvatarURL({ size: 4096, dynamic: true });
            var trabajo = "";
            if (row.trabajo === 0) { trabajo = "Ninguno" }
            if (row.trabajo === 1) { trabajo = "Taxista" }
            if (row.trabajo === 2) { trabajo = "Camionero" }
            const estEmbed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(message.author.tag)
                .addFields(
                    { name: 'Dinero: ', value: row.dinero },
                    { name: 'Dinero banco: ', value: String(row.dineroBanco) },
                    { name: 'Usuario id', value: String(row.userid), inline: true },
                    { name: 'Username', value: row.username, inline: true },
                    { name: 'Trabajo', value: trabajo, inline: true },
                )
                .setImage(avatar)
            message.channel.send({ embeds: [estEmbed] });
        });
    }
    if (message.content === "$empezar") {
        let sql_orden = `DELETE FROM data WHERE userid = ${message.author.id}`;
        db.run(sql_orden, function (err) {
            if (err) return console.log.error(err.message);
        });
        db.run('INSERT INTO data (userid, username, dinero, dineroBanco, trabajo, cuchillo, nuevemm, nuevemmBalas, bici, camion, revolver, revolverBalas, m16, m16Balas, ak47, ak47Balas, carabina, carabinaBalas, licenciaarmas, color, pais, edad, expTaxista, expCamionero) values (?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)',
            [message.author.id, message.author.tag, "0"]);
        var ns = Math.floor((Math.random() * (2 - 1 + 1)) + 1)
        var edad_ = Math.floor((Math.random() * (27 - 18 + 18)) + 18)
        var pais_ = Math.floor((Math.random() * (4 - 1 + 1)) + 1)
        var txt_ = "";
        db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
            if (ns === 1) {
                txt_ += "Color: Moreno\n"
                db.run(`UPDATE data SET color = ? WHERE userid = ?`, [1, userid]);
            }
            if (ns === 2) {
                txt_ += "Color: Blanco\n"
                db.run(`UPDATE data SET color = ? WHERE userid = ?`, [2, userid]);
            }
            if (pais_ === 1) {
                txt_ += "País: Estados Unidos\n"
                db.run(`UPDATE data SET pais = ? WHERE userid = ?`, [1, userid]);
            }
            if (pais_ === 2) {
                txt_ += "País: México\n"
                db.run(`UPDATE data SET pais = ? WHERE userid = ?`, [2, userid]);
            }
            if (pais_ === 3) {
                txt_ += "País: Argentina\n"
                db.run(`UPDATE data SET pais = ? WHERE userid = ?`, [3, userid]);
            }
            if (pais_ === 4) {
                txt_ += "País: Perú\n"
                db.run(`UPDATE data SET pais = ? WHERE userid = ?`, [4, userid]);
            }
            txt_ += "Edad: " + edad_
            db.run(`UPDATE data SET edad = ? WHERE userid = ?`, [edad_, userid]);
            const emb = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('Has nacido.')
                .setDescription(txt_)
                .setTimestamp()
            message.channel.send({ embeds: [emb] });
        });
    }

    if (message.content === "$ayuda") {
        const emb = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Ayuda')
            .addFields(
                { name: '$empezar', value: "Registrarte", inline: true },
                { name: '$est', value: "Mirar tus estadisticas", inline: true },
                { name: '$exp', value: "Mirar la experiencia que tienes en los trabajos", inline: true },
                { name: '$mercado', value: "Mirar mercado", inline: true },
                { name: '$transferir', value: "Transferir tu dinero", inline: true },
                { name: '$trabajar ', value: "Empezar a trabajar", inline: true },
                { name: '$inventario ', value: "Mirar tu inventario", inline: true },
                { name: '$comprar  ', value: "Comprar cosas del mercado", inline: true },
                { name: '$saquear ', value: "Quitarle cosas a los demás jugadores.", inline: true },
                { name: '$banco ', value: "Mirar cuanto dinero tienes en el banco.", inline: true },
                { name: '$guardar ', value: "Guardar dinero en le banco.", inline: true },
                { name: '$retirar ', value: "Retirar dinero del banco.", inline: true },
                { name: '$suicidarme', value: "Para suicidarte.", inline: true },
                { name: '$buscar [trabajo]', value: "Para saber que trabajos hay disponibles.", inline: true },
                { name: '$contrato [trabajo]', value: "Para trabajar en algún trabajo.", inline: true },
                { name: '$municion comprar [arma] [municion]', value: "Para comprar munición de alguna arma.", inline: true },
                { name: '$apostar [cantidad a apostar]', value: "Para apostar.", inline: true },
            )
            .setImage('https://www.meme-arsenal.com/memes/ec91ea20c6e7a1677615f9b01c2deaff.jpg')
            .setTimestamp()
        message.channel.send({ embeds: [emb] });
    }
    if (message.content.startsWith('¿') && message.content.endsWith('?')) {
        i = Math.floor(Math.random() * 10) + 1;
        if (i === 1) { a = 'Joder, claro q sí' }
        if (i === 2) { a = 'Joder, claro q no' }
        if (i === 3) { a = 'No sé, no soy dueño del mundo' }
        if (i === 4) { a = 'Te daré ban.' }
        if (i === 5) { a = 'No se, mejor te dmeare' }
        if (i === 6) { a = 'Sí' }
        if (i === 7) { a = 'No' }
        if (i === 8) { a = 'Joder, no tengo respuesta para esa pregunta' }
        if (i === 9) { a = 'No sé, no soy cientifico' }
        if (i === 10) { a = 'Kiensos' }
        const embedPrediccion = new MessageEmbed()
            .setTitle('Predicion')
            .setColor('RANDOM')
            .setDescription('La prediccion del owner es >> ' + '**' + a + '**')
            .addFields(
                { name: 'Pregunta ', value: "Tu pregunta es >> " + "**" + message.content + "**" },
                { name: 'Reflexion: ', value: 'Mejor aprecia que estoy re guapo =)' },
            )
            .setImage('https://www.wallpapers13.com/wp-content/uploads/2015/12/Andromeda-Spiral-galaxy-HD-wallpaper.jpg')
        message.channel.send({ embeds: [embedPrediccion] })
    }
    if (message.content === '$nombreFalso') {
        PythonShell.run('nombreFalso.py', null, function (err, result) {
            if (err) throw err;
            message.channel.send("**" + result[0] + "**");
            message.channel.send("**" + result[1] + "**");
            message.channel.send("**" + result[3] + "**");
            message.channel.send("**" + result[4] + "**");
            message.channel.send("**" + result[5] + "**");
            console.log(result[0]);
            console.log(result[1]);
            console.log(result[3]);
            console.log(result[4]);
            console.log(result[5]);
        });
    }
    if (message.content === '$mercado') {
        const mercadoEmbed = new MessageEmbed()
            .setTitle('Mercado')
            .setColor('RANDOM')
            .setDescription('Para comprar armas necesitas licencia de armas.')
            .addFields(
                { name: 'Cuchillo', value: "$300" },
                { name: 'Bici ', value: "$570" },
                { name: 'Camión: ', value: '$5,000' },
                { name: '9mm', value: '$10,000' },
                { name: 'Revolver', value: '$15,000' },
                { name: 'M16', value: '$45,000' },
                { name: 'Licencia de armas', value: '$78,0000' },
                { name: 'Carabina', value: '$350,000' },
                { name: 'Ak-47', value: '$500,000' },
            )
        message.channel.send({ embeds: [mercadoEmbed] })
    }
    if (cmd === 'comprar') {
        if (args[1]) {
            if (args[1] === 'cuchillo') {
                db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                    if (!row) return message.channel.send("No existes, usa /empezar");
                    if (row.dinero >= 300) {
                        dineroDespues_ = String(row.dinero - 300)
                        message.channel.send("Has comprado un cuchillo. Te quedan $" + dineroDespues_ + " tras la compra.")
                        db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [dineroDespues_, userid]);
                        db.run(`UPDATE data SET cuchillo = ? WHERE userid = ?`, [1, userid]);
                    }
                    else { message.channel.send("No puedes comprar el cuchillo. Te faltan $" + String(300 - row.dinero) + ".") }
                });
            }
            if (args[1] === 'bici') {
                db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                    if (!row) return message.channel.send("No existes, usa /empezar");
                    if (row.dinero >= 570) {
                        if (row.bici === 0) {
                            dineroDespues_ = String(row.dinero - 570)
                            message.channel.send("Has comprado la bici. Te quedan $" + dineroDespues_ + " tras la compra.")
                            db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [dineroDespues_, userid]);
                            db.run(`UPDATE data SET bici = ? WHERE userid = ?`, [1, userid]);
                        }
                        else { message.reply("No puedes tener mas de 1 bici.") }
                    }
                    else { message.channel.send("No puedes comprar la bici. Te faltan $" + String(570 - row.dinero) + ".") }
                });
            }

            if (args[1] === 'camion') {
                db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                    if (!row) return message.channel.send("No existes, usa /empezar");
                    if (row.dinero >= 5000) {
                        if (row.camion === 0) {
                            dineroDespues2_ = String(row.dinero - 5000)
                            message.channel.send("Has comprado un camión. Te quedan $" + dineroDespues2_ + " tras la compra.")
                            db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [dineroDespues2_, userid]);
                            db.run(`UPDATE data SET camion = ? WHERE userid = ?`, [1, userid]);
                        }
                        else { message.reply("No puedes tener mas de 1 camión.") }
                    }
                    else { message.channel.send("No puedes comprar el camión. Te faltan $" + String(5000 - row.dinero) + ".") }
                });
            }
            if (args[1] === '9mm') {
                db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                    if (!row) return message.channel.send("No existes, usa /empezar");
                    if (row.dinero >= 10000) {
                        if (row.licenciaarmas === 1) {
                            if (row.nuevemm === 0) {
                                dineroDespues2_ = String(row.dinero - 10000)
                                message.channel.send("Has comprado una 9mm. Te quedan $" + dineroDespues2_ + " tras la compra.")
                                db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [dineroDespues2_, userid]);
                                db.run(`UPDATE data SET nuevemm = ? WHERE userid = ?`, [1, userid]);
                            }
                            else { message.reply("No puedes tener mas de una 9mm.") }
                        }
                        else { message.reply("Ocupas tener licencia de armas previamente.") }
                    }
                    else { message.channel.send("No puedes comprar la 9mm. Te falta $" + String(10000 - row.dinero) + ".") }
                });
            }

            if (args[1] === 'revolver') {
                db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                    if (!row) return message.channel.send("No existes, usa /empezar");
                    if (row.dinero >= 15000) {
                        if (row.licenciaarmas === 1) {
                            if (row.revolver === 0) {
                                dineroDespues2_ = String(row.dinero - 15000)
                                message.channel.send("Has comprado una revolver. Te quedan $" + dineroDespues2_ + " tras la compra.")
                                db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [dineroDespues2_, userid]);
                                db.run(`UPDATE data SET revolver = ? WHERE userid = ?`, [1, userid]);
                            }
                            else { message.reply("No puedes tener mas de una revolver.") }
                        }
                        else { message.reply("Ocupas tener licencia de armas previamente.") }
                    }
                    else { message.channel.send("No puedes comprar la revolver. Te falta $" + String(15000 - row.dinero) + ".") }
                });
            }

            if (args[1] === 'm16') {
                db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                    if (!row) return message.channel.send("No existes, usa /empezar");
                    if (row.dinero >= 45000) {
                        if (row.licenciaarmas === 1) {
                            if (row.m16 === 0) {
                                dineroDespues2_ = String(row.dinero - 45000)
                                message.channel.send("Has comprado una revolver. Te quedan $" + dineroDespues2_ + " tras la compra.")
                                db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [dineroDespues2_, userid]);
                                db.run(`UPDATE data SET m16 = ? WHERE userid = ?`, [1, userid]);
                            }
                            else { message.reply("No puedes tener mas de una m16.") }
                        }
                        else { message.reply("Ocupas tener licencia de armas previamente.") }
                    }
                    else { message.channel.send("No puedes comprar la m16. Te falta $" + String(45000 - row.dinero) + ".") }
                });
            }

            if (args[1] === 'ak47') {
                db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                    if (!row) return message.channel.send("No existes, usa /empezar");
                    if (row.dinero >= 500000) {
                        if (row.licenciaarmas === 1) {
                            if (row.ak47 === 0) {
                                dineroDespues2_ = String(row.dinero - 500000)
                                message.channel.send("Has comprado una ak47. Te quedan $" + dineroDespues2_ + " tras la compra.")
                                db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [dineroDespues2_, userid]);
                                db.run(`UPDATE data SET ak47 = ? WHERE userid = ?`, [1, userid]);
                            }
                            else { message.reply("No puedes tener mas de una ak47.") }
                        }
                        else { message.reply("Ocupas tener licencia de armas previamente.") }
                    }
                    else { message.channel.send("No puedes comprar la ak47. Te falta $" + String(500000 - row.dinero) + ".") }
                });
            }

            if (args[1] === 'carabina') {
                db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                    if (!row) return message.channel.send("No existes, usa /empezar");
                    if (row.dinero >= 350000) {
                        if (row.licenciaarmas === 1) {
                            if (row.carabina === 0) {
                                dineroDespues2_ = String(row.dinero - 350000)
                                message.channel.send("Has comprado una carabina. Te quedan $" + dineroDespues2_ + " tras la compra.")
                                db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [dineroDespues2_, userid]);
                                db.run(`UPDATE data SET carabina = ? WHERE userid = ?`, [1, userid]);
                            }
                            else { message.reply("No puedes tener mas de una carabina.") }
                        }
                        else { message.reply("Ocupas tener licencia de armas previamente.") }
                    }
                    else { message.channel.send("No puedes comprar la carabina. Te falta $" + String(350000 - row.dinero) + ".") }
                });
            }

            if (args[1] === 'licencia') {
                db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                    if (!row) return message.channel.send("No existes, usa /empezar");
                    if (row.dinero >= 78000) {
                        if (row.licenciaarmas === 0) {
                            dineroDespues2_ = String(row.dinero - 78000)
                            message.channel.send("Has comprado una licencia de armas. Te quedan $" + dineroDespues2_ + " tras la compra.")
                            db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [dineroDespues2_, userid]);
                            db.run(`UPDATE data SET licenciaarmas = ? WHERE userid = ?`, [1, userid]);
                        }
                        else { message.reply("No puedes tener mas de una licencia de armas.") }
                    }
                    else { message.channel.send("No puedes comprar la licencia de armas. Te falta $" + String(78000 - row.dinero) + ".") }
                });
            }
        }
        else { message.reply("$comprar [opción]") }
    }

    if (message.content === "$inventario") {
        db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
            if (!row) return message.channel.send("No existes, usa /empezar");
            var nose = "";
            if (row.cuchillo === 1) { nose += "Cuchillo: Sí\n" }
            if (row.cuchillo === 0) { nose += "Cuchillo: No\n" }
            if (row.bici === 1) { nose += "Bici: Sí\n" }
            if (row.bici === 0) { nose += "Bici: No\n" }
            if (row.camion === 1) { nose += "Camión: Sí\n" }
            if (row.camion === 0) { nose += "Camión: No\n" }
            if (row.nuevemm === 1) { nose += "9mm: Sí --- Balas: " + row.nuevemmBalas + "\n" }
            if (row.nuevemm === 0) { nose += "9mm: No --- Balas: " + row.nuevemmBalas + "\n" }
            if (row.revolver === 1) { nose += "Revolver: Sí --- Balas: " + row.revolverBalas + "\n" }
            if (row.revolver === 0) { nose += "Revolver: No --- Balas: " + row.revolverBalas + "\n" }
            if (row.m16 === 1) { nose += "M16: Sí --- Balas: " + row.m16Balas + "\n" }
            if (row.m16 === 0) { nose += "M16: No --- Balas: " + row.m16Balas + "\n" }
            if (row.ak47 === 1) { nose += "Ak47: Sí --- Balas: " + row.ak47Balas + "\n" }
            if (row.ak47 === 0) { nose += "Ak47: No --- Balas: " + row.ak47Balas + "\n" }
            if (row.carabina === 1) { nose += "Carabina: Sí --- Balas: " + row.carabinaBalas + "\n" }
            if (row.carabina === 0) { nose += "Carabina: No --- Balas: " + row.carabinaBalas + "\n" }
            if (row.licenciaarmas === 1) { nose += "Licencias De Armas: Sí\n" }
            if (row.licenciaarmas === 0) { nose += "Licencias De Armas: No\n" }
            const emb = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('Inventario de ' + message.author.tag)
                .setDescription(nose)
                .setTimestamp()
            message.channel.send({ embeds: [emb] });
        });
    }

    if (cmd === "trabajar") {
        if (tiempoTrabajo.has(message.author.id)) { message.channel.send("Debes esperar 10 segundos para volver a trabajar."); } else {
            db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                if (!row) return message.channel.send("No existes, usa $empezar");
                if (row.trabajo === 0) {
                    message.reply("No tienes un trabajo. Busca uno en $buscar trabajo")
                }
                if (row.trabajo === 1) {
                    var numeroPasajeros = Math.floor((Math.random() * (15 - 1 + 1)) + 1)
                    db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                        if (!row) return message.channel.send("No existes, usa /empezar");
                        db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(row.dinero) + numeroPasajeros * 450, message.author.id]);
                        db.run(`UPDATE data SET expTaxista = ? WHERE userid = ?`, [row.expTaxista + 1, message.author.id]);
                    });
                    const emb = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Ganancia - Taxista')
                        .setDescription('Has subido a ' + numeroPasajeros + ' pasajeros y has ganado **$' + numeroPasajeros * 450 + '** y **1 exp**')
                    message.channel.send({ embeds: [emb] });
                }
                if (row.trabajo === 2) {
                    var transporteRandom = Math.floor((Math.random() * (4 - 1 + 1)) + 1)
                    var paga = Math.floor((Math.random() * (4 - 1 + 1)) + 1)
                    var transporte_ = "";
                    var paga = 0;
                    if (transporteRandom === 1) { transporte_ = "Sustancias ilegales"; paga = 45 }
                    else if (transporteRandom === 2) { transporte_ = "Mercancía líquida"; paga = 50 }
                    else if (transporteRandom === 3) { transporte_ = "Mercancía química"; paga = 70 }
                    else if (transporteRandom === 4) { transporte_ = "Mercancía gaseosa"; paga = 43 }

                    db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                        if (!row) return message.channel.send("No existes, usa /empezar");
                        db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(row.dinero) + paga * 500, message.author.id]);
                        db.run(`UPDATE data SET expCamionero = ? WHERE userid = ?`, [row.expCamionero + 1, message.author.id]);
                    });
                    const emb = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Ganancia - Camionero')
                        .setDescription('Has transportado ' + transporte_ + " y has ganado **$" + paga * 500 + "** y **1 exp**")
                    message.channel.send({ embeds: [emb] });
                }
            });
            tiempoTrabajo.add(message.author.id);
            setTimeout(() => {
                tiempoTrabajo.delete(message.author.id);
            }, 10000);
        }
    }

    if (cmd === "buscar") {
        if (args[1] === "trabajo") {
            const emb = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Trabajos')
                .setDescription('1 - taxista\n2 - camionero\nSi quieres trabajar en alguna parte usa $contrato [nombre de trabajo]')
            message.channel.send({ embeds: [emb] });
        }
        else { message.reply("Argumentos desconocidos.") }
    }

    if (cmd === "contrato") {
        db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
            if (args[1]) {
                if (args[1] === "taxista") {
                    if (!row) return message.channel.send("No existes, usa /empezar");
                    db.run(`UPDATE data SET trabajo = ? WHERE userid = ?`, [1, message.author.id]);
                    message.reply("Ahora trabajas en **taxista**")
                }
                else if (args[1] === "camionero") {
                    if (!row) return message.channel.send("No existes, usa /empezar");
                    if (row.camion === 0) return message.reply("Ocupas comprar un camión para trabajar en camionero. $mercado")
                    else {
                        db.run(`UPDATE data SET trabajo = ? WHERE userid = ?`, [2, message.author.id]);
                        message.reply("Ahora trabajas en **camionero**")
                    }
                }
                else { message.reply("Trabajo desconocido") }
            }
            else { message.reply("$contrato [nombre del trabajo]") }
        });
    }

    if (cmd === "transferir") {
        let user = message.mentions.users.first()
        if (user === message.author) return message.channel.send("No te puedes transferir a ti mismo")
        if (!user) return message.reply("Menciona alguien")
        if (user) {
            if (args[2]) {
                if (Number.isInteger(parseInt(args[2]))) {
                    db.each(`SELECT dinero FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                        if (!row) return message.channel.send("No existes, usa /empezar");
                        if (parseInt(args[2]) > parseInt(row.dinero)) return message.channel.send("Te falta dinero")
                        else {
                            db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(row.dinero) - args[2], message.author.id]);
                            db.each(`SELECT dinero FROM data WHERE userid="${user.id}"`, function (err, rowU) {
                                if (!row) return message.channel.send("No existes, usa /empezar");
                                db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(rowU.dinero) + parseInt(args[2]), user.id]);
                                const emb = new MessageEmbed()
                                    .setColor('RANDOM')
                                    .setTitle('Transferencia')
                                    .setDescription('Le has transferido a ' + user.tag + " $" + args[2])
                                message.channel.send({ embeds: [emb] });
                            });
                        }
                    });
                }
                else { message.reply("Solo números") }
            }
        }
    }

    if (cmd === "vest") {
        if (args[1]) {
            const user = message.mentions.users.first()
            if (user === message.author) return message.channel.send("Usa $est")
            if (!user) return message.reply("Menciona alguien.")
            else {
                db.each(`SELECT * FROM data WHERE userid="${user.id}"`, function (err, row) {
                    if (!row) return message.channel.send("No existes. Usa $empezar")
                    var trabajo = "";
                    if (row.trabajo === 0) { trabajo = "Ninguno" }
                    if (row.trabajo === 1) { trabajo = "Taxista" }
                    if (row.trabajo === 2) { trabajo = "Camionero" }

                    let avatar = user.displayAvatarURL({ size: 4096, dynamic: true });
                    const ns = new MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle(user.tag)
                        .addFields(
                            { name: 'Dinero: ', value: row.dinero },
                            { name: 'Dinero banco: ', value: String(row.dineroBanco) },
                            { name: 'Usuario id', value: String(row.userid), inline: true },
                            { name: 'Username', value: row.username, inline: true },
                            { name: 'Trabajo', value: trabajo, inline: true },
                        )
                        .setImage(avatar)
                    message.channel.send({ embeds: [ns] });
                });
            }
        }
        else { message.reply("$vest [usuario].") }
    }

    if (cmd === "banco") {
        db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
            if (!row) return message.channel.send("No existes. Usa $empezar")
            let avatar = message.author.displayAvatarURL({ size: 4096, dynamic: true });
            const emb = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Estadísticas de Banco')
                .addFields(
                    { name: 'En el banco tienes: ', value: String(row.dineroBanco), inline: true }
                )
                .setImage(avatar)
            message.channel.send({ embeds: [emb] });
        });
    }

    if (cmd === "guardar") {
        db.each(`SELECT dinero,dineroBanco FROM data WHERE userid="${message.author.id}"`, function (err, row) {
            if (args[1]) {
                if (args[1] === "todo") {
                    if (parseInt(row.dinero) === 0) return message.reply("No tienes dinero en mano.")
                    else {
                        db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [0, message.author.id]);
                        db.run(`UPDATE data SET dineroBanco = ? WHERE userid = ?`, [parseInt(row.dineroBanco) + parseInt(row.dinero), message.author.id]);
                        message.reply("Has guardado " + row.dinero + " al banco.")
                    }
                }
                else if (!isNaN(args[1])) {
                    if (args[1] > row.dinero) return message.reply("No puedes guardar más de lo que tienes.")
                    else {
                        db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(row.dinero) - parseInt(args[1]), message.author.id]);
                        db.run(`UPDATE data SET dineroBanco = ? WHERE userid = ?`, [parseInt(row.dineroBanco) + parseInt(args[1]), message.author.id]);
                        message.reply("Has guardado " + args[1] + " al banco.")
                    }
                }
                else { message.reply("Opción incorrecta.") }
            }
        });
    }

    if (cmd === "retirar") {
        db.each(`SELECT dinero,dineroBanco FROM data WHERE userid="${message.author.id}"`, function (err, row) {
            if (args[1]) {
                if (args[1] === "todo") {
                    if (parseInt(row.dineroBanco) === 0) return message.reply("No tienes dinero en banco.")
                    else {
                        db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(row.dinero) + parseInt(row.dineroBanco), message.author.id]);
                        db.run(`UPDATE data SET dineroBanco = ? WHERE userid = ?`, [0, message.author.id]);
                        message.reply("Has retirado " + row.dineroBanco + " del banco.")
                    }
                }
                else if (!isNaN(args[1])) {
                    if (args[1] > row.dineroBanco) return message.reply("No puedes retirar más de lo que tienes.")
                    else {
                        db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(row.dinero) + parseInt(args[1]), message.author.id]);
                        db.run(`UPDATE data SET dineroBanco = ? WHERE userid = ?`, [parseInt(row.dineroBanco) - parseInt(args[1]), message.author.id]);
                        message.reply("Has retirado " + args[1] + " al banco.")
                    }
                }
                else { message.reply("Opción incorrecta.") }
            }
        });
    }

    if (cmd === "vender") {
        if (args[1] === "camion") {
            db.each(`SELECT dinero,dineroBanco,camion FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                if (!row) return message.channel.send("No existes. Usa $empezar")
                if (row.camion === 0) return message.reply("No tienes un camión.")
                db.run(`UPDATE data SET camion = ? WHERE userid = ?`, [0, message.author.id]);
                message.reply("Has vendido un camion. Te depositaron $6400 en el banco.")
                db.run(`UPDATE data SET dineroBanco = ? WHERE userid = ?`, [parseInt(row.dineroBanco) + parseInt(6400), message.author.id]);
            });
        }
        else if (args[1] === "bici") {
            db.each(`SELECT dinero,dineroBanco,bici FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                if (!row) return message.channel.send("No existes. Usa $empezar")
                if (row.bici === 0) return message.reply("No tienes una bici.")
                db.run(`UPDATE data SET bici = ? WHERE userid = ?`, [0, message.author.id]);
                message.reply("Has vendido una bici. Te depositaron $228 en el banco.")
                db.run(`UPDATE data SET dineroBanco = ? WHERE userid = ?`, [parseInt(row.dineroBanco) + parseInt(228), message.author.id]);
            });
        }
        else { message.reply("Objeto desconocido.") }
    }

    if (cmd === "dinero") {
        let rol = message.guild.roles.cache.find(r => r.name === "Owner");
        if (!rol) { message.channel.send('Rol inexistente.'); }
        else {
            if (message.member.roles.cache.has(rol.id)) {
                if (args[2]) {
                    let user = message.mentions.users.first()
                    if (!user) return message.reply("Menciona alguien.")
                    else {
                        if (isNaN(args[2])) { message.reply("Inserta numero entero") }
                        else {
                            db.each(`SELECT dinero FROM data WHERE userid="${user.id}"`, function (err, row) {
                                if (!row) return message.channel.send("No existes. Usa $empezar")
                                db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(args[2]), user.id]);
                                message.reply("Le has dado $" + args[2] + " al usuario <@" + user.id + ">")
                            });
                        }
                    }
                }
                else { message.reply("Falta de argumentos.") }
            }
            else { message.reply("Falta de permisos.") }
        }
    }
    if (cmd === "sbanco") {
        let rol = message.guild.roles.cache.find(r => r.name === "Owner");
        if (!rol) { message.channel.send('Rol inexistente.'); }
        else {
            if (message.member.roles.cache.has(rol.id)) {
                if (args[2]) {
                    let user = message.mentions.users.first()
                    if (!user) return message.reply("Debes mencionar al usuario a darle dinero.")
                    if (isNaN(args[2])) return message.reply("Solo números")
                    else {
                        db.each(`SELECT dineroBanco FROM data WHERE userid="${user.id}"`, function (err, row) {
                            if (!row) return message.channel.send("No existes. Usa $empezar")
                            db.run(`UPDATE data SET dineroBanco = ? WHERE userid = ?`, [parseInt(args[2]), user.id]);
                            message.reply("Le has dado $" + args[2] + " al usuario <@" + user.id + "> al banco")
                        });
                    }
                }
                else { message.reply("Falta de argumentos.")
                }
            }
            else { message.reply("Falta de permisos.") }
        }
    }

    if (cmd === "suicidarme") {
        let usuario_ = message.author;

        let sql_orden = `DELETE FROM data WHERE userid = ${usuario_.id}`;
        db.run(sql_orden, function (err) {
            if (err) return console.log.error(err.message);
            message.channel.send(usuario_.username + " se ha suicidado.");
        });
    }

    if (cmd === "municion") {
        if (args[1] === 'precio') { message.reply("9mm: 10k - 1 bala\nRevolver: 15k - 1 bala\nM16: 150k - 1 bala\nCarabina: 200k - 1 bala\nAk-47: 400k - 1 bala") }
        if (args[1] === 'comprar') {
            if (args[2] === '9mm') {
                if (args[3]) {
                    db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                        if (!row) return message.channel.send("No existes, usa /empezar");
                        if (row.licenciaarmas === 0) { message.reply("Ocupas licencia de arma para comprar munición.") }
                        else {
                            if (parseInt(row.dinero) >= parseInt(args[3] * 10000)) {
                                message.reply("Has comprado " + args[3] + " balas para la 9mm. Precio total: " + args[3] * 10000)
                                db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [row.dinero - parseInt(args[3] * 10000), message.author.id]);
                                db.run(`UPDATE data SET nuevemmBalas = ? WHERE userid = ?`, [parseInt(args[3]) + row.nuevemmBalas, message.author.id]);
                            }
                            else { message.reply("Te falta " + String(parseInt(args[3] * 10000) - row.dinero)) }
                        }
                    });
                }
            }
            if (args[2] === 'revolver') {
                if (args[3]) {
                    db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                        if (!row) return message.channel.send("No existes, usa /empezar");
                        if (row.licenciaarmas === 0) { message.reply("Ocupas licencia de arma para comprar munición.") }
                        else {
                            if (parseInt(row.dinero) >= parseInt(args[3] * 15000)) {
                                message.reply("Has comprado " + args[3] + " balas para la revolver. Precio total: " + args[3] * 15000)
                                db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [row.dinero - parseInt(args[3] * 15000), message.author.id]);
                                db.run(`UPDATE data SET revolverBalas = ? WHERE userid = ?`, [parseInt(args[3]) + row.revolverBalas, message.author.id]);
                            }
                            else { message.reply("Te falta " + String(parseInt(args[3] * 15000) - row.dinero)) }
                        }
                    });
                }
            }
            if (args[2] === 'm16') {
                if (args[3]) {
                    db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                        if (!row) return message.channel.send("No existes, usa /empezar");
                        if (row.licenciaarmas === 0) { message.reply("Ocupas licencia de arma para comprar munición.") }
                        else {
                            if (parseInt(row.dinero) >= parseInt(args[3] * 150000)) {
                                message.reply("Has comprado " + args[3] + " balas para la m16. Precio total: " + args[3] * 150000)
                                db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [row.dinero - parseInt(args[3] * 150000), message.author.id]);
                                db.run(`UPDATE data SET m16Balas = ? WHERE userid = ?`, [parseInt(args[3]) + row.m16Balas, message.author.id]);
                            }
                            else { message.reply("Te falta " + String(parseInt(args[3] * 150000) - row.dinero)) }
                        }
                    });
                }
            }
            if (args[2] === 'carabina') {
                if (args[3]) {
                    db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                        if (!row) return message.channel.send("No existes, usa /empezar");
                        if (row.licenciaarmas === 0) { message.reply("Ocupas licencia de arma para comprar munición.") }
                        else {
                            if (parseInt(row.dinero) >= parseInt(args[3] * 200000)) {
                                message.reply("Has comprado " + args[3] + " balas para la carabina. Precio total: " + args[3] * 200000)
                                db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [row.dinero - parseInt(args[3] * 200000), message.author.id]);
                                db.run(`UPDATE data SET carabinaBalas = ? WHERE userid = ?`, [parseInt(args[3]) + row.carabinaBalas, message.author.id]);
                            }
                            else { message.reply("Te falta " + String(parseInt(args[3] * 200000) - row.dinero)) }
                        }
                    });
                }
            }
            if (args[2] === 'ak47') {
                if (args[3]) {
                    db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
                        if (!row) return message.channel.send("No existes, usa /empezar");
                        if (row.licenciaarmas === 0) { message.reply("Ocupas licencia de arma para comprar munición.") }
                        else {
                            if (parseInt(row.dinero) >= parseInt(args[3] * 400000)) {
                                message.reply("Has comprado " + args[3] + " balas para la Ak47. Precio total: " + args[3] * 400000)
                                db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [row.dinero - parseInt(args[3] * 400000), message.author.id]);
                                db.run(`UPDATE data SET ak47Balas = ? WHERE userid = ?`, [parseInt(args[3]) + row.ak47Balas, message.author.id]);
                            }
                            else { message.reply("Te falta " + String(parseInt(args[3] * 400000) - row.dinero)) }
                        }
                    });
                }
            }
        }
    }

    if (cmd === "apostar") {
        db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
            if (args[1]) {
                if (!isNaN(args[1])) {
                    if (parseInt(args[1]) > row.dinero) return message.reply("No puedes apostar más de lo que tienes.")
                    if (parseInt(args[1]) <= 0) return message.reply("No puedes apostar nada")
                    var numeroRandom_ = Math.floor((Math.random() * (2 - 1 + 1)) + 1)
                    if (parseInt(numeroRandom_) === 1) {
                        db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(row.dinero) - parseInt(args[1] * 2), userid]);
                        const emb = new MessageEmbed()
                            .setColor('RED')
                            .setTitle('Apuesta inicial: ' + parseInt(args[1]))
                            .setDescription("Has perdido " + parseInt(args[1] * 2))
                            .setTimestamp()
                        message.channel.send({ embeds: [emb] });
                    }
                    if (parseInt(numeroRandom_) === 2) {
                        db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(row.dinero) + parseInt(args[1] * 2), userid]);
                        const emb = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle('Apuesta inicial: ' + parseInt(args[1]))
                            .setDescription("Has ganado " + parseInt(args[1] * 2))
                            .setTimestamp()
                        message.channel.send({ embeds: [emb] });
                    }
                }
                else { message.reply("Sólo números") }
            }
            else { message.reply("$apostar [dinero a apostar]") }
        });
    }

    if (cmd === "saquear") {
        db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
            if (args[1]) {
                const usuarioV_ = message.mentions.users.first()
                if (!usuarioV_) return message.reply("Menciona alguien para saquearlo")
                else {
                    if (args[2]) {
                        db.each(`SELECT * FROM data WHERE userid="${usuarioV_.id}"`, function (err, rowV) {
                            if (args[2] === "9mm") {
                                if (row.nuevemm === 0) return message.reply("No tienes una 9mm")
                                if (row.nuevemmBalas === 0) return message.reply("No tienes munición en tu 9mm")
                                else {
                                    if (parseInt(rowV.dinero) === 0) return message.reply("Usuario sin dinero")
                                    var robado = parseInt(rowV.dinero) * 20;
                                    var robado = parseInt(robado) / 100
                                    const emb = new MessageEmbed()
                                        .setColor('GREEN')
                                        .setTitle('Asalto a ' + usuarioV_.tag)
                                        .setDescription("Le has robado a " + String(usuarioV_) + " $" + parseInt(robado))
                                        .setTimestamp()
                                    message.channel.send({ embeds: [emb] });
                                    db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(row.dinero) + parseInt(robado), userid]);
                                    db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(rowV.dinero) - parseInt(robado), usuarioV_.id]);
                                }
                            }
                            if (args[2] === "revolver") {
                                if (row.revolver === 0) return message.reply("No tienes una revolver")
                                if (row.revolverBalas === 0) return message.reply("No tienes munición en tu revolver")
                                else {
                                    if (parseInt(rowV.dinero) === 0) return message.reply("Usuario sin dinero")
                                    var robado = parseInt(rowV.dinero) * 20;
                                    var robado = parseInt(robado) / 100
                                    const emb = new MessageEmbed()
                                        .setColor('GREEN')
                                        .setTitle('Asalto a ' + usuarioV_.tag)
                                        .setDescription("Le has robado a " + String(usuarioV_) + " $" + parseInt(robado))
                                        .setTimestamp()
                                    message.channel.send({ embeds: [emb] });
                                    db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(row.dinero) + parseInt(robado), userid]);
                                    db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(rowV.dinero) - parseInt(robado), usuarioV_.id]);
                                }
                            }
                            if (args[2] === "m16") {
                                if (row.m16 === 0) return message.reply("No tienes una m16")
                                if (row.m16Balas === 0) return message.reply("No tienes munición en tu m16")
                                else {
                                    if (parseInt(rowV.dinero) === 0) return message.reply("Usuario sin dinero")
                                    var robado = parseInt(rowV.dinero) * 60;
                                    var robado = parseInt(robado) / 100
                                    const emb = new MessageEmbed()
                                        .setColor('GREEN')
                                        .setTitle('Asalto a ' + usuarioV_.tag)
                                        .setDescription("Le has robado a " + String(usuarioV_) + " $" + parseInt(robado))
                                        .setTimestamp()
                                    message.channel.send({ embeds: [emb] });
                                    db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(row.dinero) + parseInt(robado), userid]);
                                    db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(rowV.dinero) - parseInt(robado), usuarioV_.id]);
                                }
                            }
                            if (args[2] === "carabina") {
                                if (row.carabina === 0) return message.reply("No tienes una carabina")
                                if (row.carabinaBalas === 0) return message.reply("No tienes munición en tu carabina")
                                else {
                                    if (parseInt(rowV.dinero) === 0) return message.reply("Usuario sin dinero")
                                    var robado = parseInt(rowV.dinero) * 80;
                                    var robado = parseInt(robado) / 100
                                    const emb = new MessageEmbed()
                                        .setColor('GREEN')
                                        .setTitle('Asalto a ' + usuarioV_.tag)
                                        .setDescription("Le has robado a " + String(usuarioV_) + " $" + parseInt(robado))
                                        .setTimestamp()
                                    message.channel.send({ embeds: [emb] });
                                    db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(row.dinero) + parseInt(robado), userid]);
                                    db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(rowV.dinero) - parseInt(robado), usuarioV_.id]);
                                }
                            }
                            if (args[2] === "ak47") {
                                if (row.ak47 === 0) return message.reply("No tienes una ak47")
                                if (row.ak47Balas === 0) return message.reply("No tienes munición en tu ak47")
                                else {
                                    if (parseInt(rowV.dinero) <= 0) return message.reply("Usuario sin dinero")
                                    var robado = parseInt(rowV.dinero) * 80;
                                    var robado = parseInt(robado) / 100
                                    const emb = new MessageEmbed()
                                        .setColor('GREEN')
                                        .setTitle('Asalto a ' + usuarioV_.tag)
                                        .setDescription("Le has robado a " + String(usuarioV_) + " $" + parseInt(robado))
                                        .setTimestamp()
                                    message.channel.send({ embeds: [emb] });
                                    db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(row.dinero) + parseInt(robado), userid]);
                                    db.run(`UPDATE data SET dinero = ? WHERE userid = ?`, [parseInt(rowV.dinero) - parseInt(robado), usuarioV_.id]);
                                }
                            }
                        });
                    }
                    else { message.reply("Introduce nombre del arma") }
                }
            }
            else { message.reply("$saquear [usuario] [arma]") }
        });
    }

    if (cmd === "rasgos") {
        db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
            if (!row) return message.channel.send("No existes, usa /empezar");
            var color_ = "";
            var pais_ = "";
            if (row.color === 1) { color_ = "Moreno"; }
            if (row.color === 2) { color_ = "Blanco"; }
            if (row.pais === 1) { pais_ = "País: Estados Unidos" }
            if (row.pais === 2) { pais_ = "País: México" }
            if (row.pais === 3) { pais_ = "País: Argentina" }
            if (row.pais === 4) { pais_ = "País: Perú" }
            const emb = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('Rasgos de ' + message.author.tag)
                .setDescription("Color: " + color_ + "\nPaís: " + pais_ + "\nEdad: " + String(row.edad))
                .setTimestamp()
            message.channel.send({ embeds: [emb] });
        });
    }

    if (cmd === "exp") {
        db.each(`SELECT * FROM data WHERE userid="${message.author.id}"`, function (err, row) {
            let avatar = message.author.displayAvatarURL({ size: 4096, dynamic: true });
            const estEmbed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Experiencia de trabajo de ' + message.author.tag)
                .setDescription('Experiencia Taxista: **' + String(row.expTaxista) + "**\nExperiencia Camionero: **" + String(row.expCamionero) + "**")
                .setImage(avatar)
            message.channel.send({ embeds: [estEmbed] });
        });
    }

});

client.login(config.token);