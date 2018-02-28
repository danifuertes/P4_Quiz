//Requires iniciales
const model = require('./model');
const {log, biglog, errlog, colorize} = require('./out');

// Descripción de la funciones de los comandos
//AYUDA
exports.helpCmd = rl => {
	log("Commandos:");
	log("	h|help - Muestra esta ayuda.");
	log("	list - Listar los quizzes existentes.");
	log("	show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
	log("	add - Añadir un nuevo quiz interactivamente.");
	log("	delete <id> - Borrar el quiz indicado.");
	log("	edit <id> - Editar el quiz indicado.");
	log("	test <id> - Probar el quiz indicado.");
	log("	p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
	log("	credits - Créditos.");
	log("	q|quit - Salir del programa.");
	rl.prompt();
};

//LISTAR
exports.listCmd = rl => {
	model.getAll().forEach((quiz, id) => {
		log(`	[${colorize(id, 'magenta')}]: ${quiz.question}`);
	});
	rl.prompt();
};

//MOSTRAR
exports.showCmd = (id, rl) => {
	if (typeof id === "undefined") {
		errlog(`Es necesario indicar el índice de la pregunta que desea mostrar`);
	} else {
		try {
			const quiz = model.getByIndex(id);
			log(`	[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`)
		} catch (error) {
			errlog(error.message);
		}
	}
	rl.prompt();
};

//AÑADIR
exports.addCmd = rl => {
	rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
		rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {
			model.add(question, answer);
			log(`	${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
			rl.prompt();
		});
	});
};

//BORRAR
exports.deleteCmd = (id, rl) => {
	if (typeof id === "undefined") {
		errlog(`Es necesario indicar el índice de la pregunta que desea mostrar`);
	} else {
		try {
			model.deleteByIndex(id);
		} catch (error) {
			errlog(error.message);
		}
	}
	rl.prompt();
};

//EDITAR
exports.editCmd = (id, rl) => {
	if (typeof id === "undefined") {
		errlog(`Es necesario indicar el índice de la pregunta que desea mostrar`);
		rl.prompt();
	} else {
		try {
			const quiz = model.getByIndex(id);
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
			rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
				rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {
					model.update(id, question, answer);
					log(`	Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
					rl.prompt();
				});
			});
		} catch (error) {
			errlog(error.message);
			rl.prompt();
		}
	}
};

//TEST
exports.testCmd = (id, rl) => {
	if (typeof id === "undefined") {
		errlog(`Es necesario indicar el índice de la pregunta que desea mostrar`);
		rl.prompt();
	} else {
		try {
			const quiz = model.getByIndex(id);
			rl.question(colorize(` ¿${quiz.question}? `, 'red'), answer => {
				log(' Su contestación es:\n');
				let user = answer.trim().toLowerCase();
				let real = quiz.answer.trim().toLowerCase();
				if (user === real){
					biglog('CORRECTO', 'green');
					rl.prompt();
				} else {
					biglog('INCORRECTO', 'red');
					rl.prompt();
				}
			});
		} catch (error) {
			errlog(error.message);
			rl.prompt();
		}
	}
	rl.prompt();
};


//JUGAR
exports.playCmd = rl => {
	let n = model.count();
	let score = 0;
	let toBeResolved = [];
	for (let i = 0; i < n; i++) {
		toBeResolved.push(i);
	}
	if (toBeResolved.length === 0){
		log('No hay preguntas para responder', 'red');
		rl.prompt();
	} else {
		try {
			const playOne = () => {
				let id = Math.floor(Math.random()*toBeResolved.length);
				let quiz = model.getByIndex(toBeResolved[id]);
				toBeResolved.splice(id, 1);
				rl.question(colorize(` ¿${quiz.question}? `, 'red'), answer => {
					log(' Su contestación es:\n');
					let user = answer.trim().toLowerCase();
					let real = quiz.answer.trim().toLowerCase();
					if (user === real){
						biglog('CORRECTO', 'green');
						score++;
						if (toBeResolved.length === 0){
							log('¡Has respondido a todas las preguntas con éxito!', 'red');
							log(`Puntuación final: ${colorize(score, 'green')} puntos`);
							rl.prompt();
						} else {
							playOne();
						}
					} else {
						biglog('INCORRECTO', 'red');
						log(`Puntuación final: ${colorize(score, 'green')} puntos`);
						rl.prompt();
					}
				});
			}
			playOne();
		} catch (error) {
			errlog(error.message);
			rl.prompt();
		}
	}
};

//CRÉDITOS
exports.creditsCmd = rl => {
	log("Autores de la práctica:", 'red');
	log("	Daniel Fuertes Coiras", 'red');
	log("	Alexander de la Torre Astanin", 'red');
  	rl.prompt();
};

//SALIR
exports.quitCmd = rl => {
	rl.close();
};