//Requires iniciales
const {models} = require('./model');
const {log, biglog, errlog, colorize} = require('./out');
const Sequelize = require('sequelize');

// Descripción de la funciones auxiliares
//VALIDAR ÍNDICE
const validateId = id => {
	return new Sequelize.Promise((resolve, reject) => {
		if (typeof id === "undefined") {
			reject(new Error(`Falta el parámetro <id>.`));
		} else {
			id = parseInt(id);
			if (Number.isNaN(id)) {
				reject(new Error(`El valor del parámetro <id> no es un número.`))
			} else {
				resolve(id);
			}
		}
	});
};

const makeQuestion = (rl, text) => {
	return new Promise((resolve, reject) => {
		rl.question(colorize(text, 'red'), answer => {
			resolve(answer.trim());
		});
	});
};

// Descripción de la funciones de los comandos
//AYUDA
exports.helpCmd = (socket, rl) => {
	log(socket, "Commandos:");
	log(socket, "	h|help - Muestra esta ayuda.");
	log(socket, "	list - Listar los quizzes existentes.");
	log(socket, "	show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
	log(socket, "	add - Añadir un nuevo quiz interactivamente.");
	log(socket, "	delete <id> - Borrar el quiz indicado.");
	log(socket, "	edit <id> - Editar el quiz indicado.");
	log(socket, "	test <id> - Probar el quiz indicado.");
	log(socket, "	p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
	log(socket, "	credits - Créditos.");
	log(socket, "	q|quit - Salir del programa.");
	rl.prompt();
};

//LISTAR
exports.listCmd = (socket, rl) => {
	models.quiz.findAll()
	.each(quiz => {
		log(socket, `	[${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);
	})
	.catch(error => {
		errlog(socket, error.message);
	})
	.then(() => {
		rl.prompt();
	});
};

//MOSTRAR
exports.showCmd = (socket, id, rl) => {
	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz => {
		if (!quiz) {
			throw new Error(`No existe un quiz asociado al id = ${id}.`);
		}
		log(socket, `	[${colorize(quiz.id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
	})
	.catch(error => {
		errlog(socket, error.message);
	})
	.then(() => {
		rl.prompt();
	});
};

//AÑADIR
exports.addCmd = (socket, rl) => {
	makeQuestion(rl, ' Introduzca una pregunta: ')
	.then(q => {
		return makeQuestion(rl, ' Introduzca la respuesta: ')
		.then(a => {
			return {question: q, answer: a};
		})
	})
	.then(quiz => {
		return models.quiz.create(quiz);
	})
	.then(quiz => {
		log(socket, ` ${colorize('Se ha añadido', 'magenta')}: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
	})
	.catch(Sequelize.ValidationError, error => {
		errlog(socket, 'El quiz es erróneo: ');
		error.errors.forEach(({message}) => errlog(socket, message));
	})
	.catch(error => {
		errlog(socket, error.message);
	})
	.then(() => {
		rl.prompt();
	});
};

//BORRAR
exports.deleteCmd = (socket, id, rl) => {
	validateId(id)
	.then(id => models.quiz.destroy({where: {id}}))
	.catch(error => {
		errlog(socket, error.message);
	})
	.then(() => {
		rl.prompt();
	});
};

//EDITAR
exports.editCmd = (socket, id, rl) => {
	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz => {
		if (!quiz) {
			throw new Error(`No existe un quiz asociado al id = ${id}.`);
		}
		process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
		return makeQuestion(rl, ' Modifique la pregunta: ')
		.then(q => {
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
			return makeQuestion(rl, ' Modifique la respuesta: ')
			.then(a => {
				quiz.question = q;
				quiz.answer = a;
				return quiz;
			});
		});
	})
	.then(quiz => {
		return quiz.save();
	})
	.then(quiz => {
		log(socket, ` Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} por: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
	})
	.catch(Sequelize.ValidationError, error => {
		errlog(socket, 'El quiz es erróneo: ');
		error.errors.forEach(({message}) => errlog(socket, message));
	})
	.catch(error => {
		errlog(socket, error.message);
	})
	.then(() => {
		rl.prompt();
	});
};

//TEST
exports.testCmd = (socket, id, rl) => {
	return new Promise ((resolve, reject) => {
		validateId(id)
		.then(id => models.quiz.findById(id))
		.then(quiz => {
			if (!quiz) {
				throw new Error(`No existe un quiz asociado al id = ${id}.`);
			}
			return makeQuestion(rl, ` ¿${quiz.question}? `)
			.then(a => {
				return {user: a, real: quiz.answer};
			});
		})
		.then(check => {
			let user = check.user.trim().toLowerCase();
			let real = check.real.trim().toLowerCase();
			if (user === real){
				log(socket, 'Su respuesta es correcta.');
				biglog(socket, 'Correcta', 'green');
				resolve();
				return;
			} else {
				log(socket, 'Su respuesta es incorrecta.');
				biglog(socket, 'Incorrecta', 'red');
				resolve();
				return;
			}
		})
		.catch(Sequelize.ValidationError, error => {
			errlog(socket, 'El quiz es erróneo: ');
			error.errors.forEach(({message}) => errlog(socket, message));
		})
		.catch(error => {
			errlog(socket, error.message);
		})
		.then(() => {
			rl.prompt();
		});
	});
};


//JUGAR
exports.playCmd = (socket, rl) => {

	let score = 0;
	let toBeResolved = [];

	models.quiz.findAll()
	.then(quizzes => {
		return new Sequelize.Promise((resolve, reject) => {
			toBeResolved = quizzes;
			resolve();
			return;
		})
		
	})
	.then(() => {
		return playOne();
	})
	.catch(Sequelize.ValidationError, error => {
		errlog('El quiz es erróneo: ');
		error.errors.forEach(({message}) => errlog(socket, message));
	})
	.catch(error => {
		errlog(socket, error.message);
	})
	.then(() => {
		rl.prompt();
		return;
	});

	const playOne = () => {
		return new Sequelize.Promise ((resolve, reject) => {
			if (toBeResolved.length === 0) {
				log(socket, ` No hay nada más que preguntar. Fin del juego. Aciertos: ${score}`);
				resolve();
				return;
				//biglog(`${score}`, 'magenta');
			} else {
				let rnd = Math.floor(Math.random()*toBeResolved.length);
				let quiz = toBeResolved[rnd];
				toBeResolved.splice(rnd, 1);
				if (!quiz) {
					throw new Error(`No existe un quiz asociado al id = ${id}.`);
				} else {
					makeQuestion(rl, ` ¿${quiz.question}? `)
					.then(answer => {
						let user = answer.trim().toLowerCase();
						let real = quiz.answer.trim().toLowerCase();
						if (user === real){
							score++;
							log(socket, ` CORRECTO - LLeva ${score} aciertos.`);
							if (toBeResolved.length === 0){
								log(socket, ` No hay nada más que preguntar. Fin del juego. Aciertos: ${score}`);
								//biglog(`${score}`, 'magenta');
								resolve();
								return;
							} else {
								resolve(playOne());
								return;
							}
						} else {
							log(socket, ` INCORRECTO. Fin del juego. Aciertos: ${score}`);
							//biglog(`${score}`, 'magenta');
							resolve();
							return;
						}
					})
				}
			}
		});
	}
};

//CRÉDITOS
exports.creditsCmd = (socket, rl) => {
	log("Autores de la práctica:", 'red');
	log("	Daniel Fuertes Coiras", 'red');
  	rl.prompt();
};

//SALIR
exports.quitCmd = (socket, rl) => {
	rl.close();
	socket.end();
};