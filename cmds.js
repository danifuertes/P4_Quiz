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
	models.quiz.findAll()
	.each(quiz => {
		log(`	[${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);
	})
	.catch(error => {
		errlog(error.message);
	})
	.then(() => {
		rl.prompt();
	});
};

//MOSTRAR
exports.showCmd = (id, rl) => {
	validateId(id)
	.then(id => models.quiz.findById(id))
	.then(quiz => {
		if (!quiz) {
			throw new Error(`No existe un quiz asociado al id = ${id}.`);
		}
		log(`	[${colorize(quiz.id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
	})
	.catch(error => {
		errlog(error.message);
	})
	.then(() => {
		rl.prompt();
	});
};

//AÑADIR
exports.addCmd = rl => {
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
		log(` ${colorize('Se ha añadido', 'magenta')}: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
	})
	.catch(Sequelize.ValidationError, error => {
		errlog('El quiz es erróneo: ');
		error.errors.forEach(({message}) => errlog(message));
	})
	.catch(error => {
		errlog(error.message);
	})
	.then(() => {
		rl.prompt();
	});
};

//BORRAR
exports.deleteCmd = (id, rl) => {
	validateId(id)
	.then(id => models.quiz.destroy({where: {id}}))
	.catch(error => {
		errlog(error.message);
	})
	.then(() => {
		rl.prompt();
	});
};

//EDITAR
exports.editCmd = (id, rl) => {
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
		log(` Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} por: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
	})
	.catch(Sequelize.ValidationError, error => {
		errlog('El quiz es erróneo: ');
		error.errors.forEach(({message}) => errlog(message));
	})
	.catch(error => {
		errlog(error.message);
	})
	.then(() => {
		rl.prompt();
	});
};

//TEST
exports.testCmd = (id, rl) => {
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
				log('Su respuesta es correcta.');
				biglog('Correcta', 'green');
				resolve();
				return;
			} else {
				log('Su respuesta es incorrecta.');
				biglog('Incorrecta', 'red');
				resolve();
				return;
			}
		})
		.catch(Sequelize.ValidationError, error => {
			errlog('El quiz es erróneo: ');
			error.errors.forEach(({message}) => errlog(message));
		})
		.catch(error => {
			errlog(error.message);
		})
		.then(() => {
			rl.prompt();
		});
	});
};


//JUGAR
exports.playCmd = rl => {

	let score = 0;
	let toBeResolved = [];

	models.quiz.findAll()
	.each(quiz => {
		toBeResolved.push(quiz.id);
	})
	.then(() => {
		return playOne();
	})
	.catch(Sequelize.ValidationError, error => {
		errlog('El quiz es erróneo: ');
		error.errors.forEach(({message}) => errlog(message));
	})
	.catch(error => {
		errlog(error.message);
	})
	.then(() => {
		rl.prompt();
		return;
	});

	const playOne = () => {
		return new Sequelize.Promise ((resolve, reject) => {
			if (toBeResolved.length === 0) {
				log(` No hay nada más que preguntar. Fin del juego. Aciertos: ${score}`);
				resolve();
				return;
				//biglog(`${score}`, 'magenta');
			} else {
				let rnd = Math.floor(Math.random()*toBeResolved.length);
				id = toBeResolved[rnd];
				toBeResolved.splice(rnd, 1);
			}
			validateId(id)
			.then(id => models.quiz.findById(id))
			.then(quiz => {
				if (!quiz) {
					throw new Error(`No existe un quiz asociado al id = ${id}.`);
				}
				return makeQuestion(rl, ` ¿${quiz.question}? `)
				.then(a => {
					resolve();
					return {user: a, real: quiz.answer};
				});
			})
			.then(check => {
				let user = check.user.trim().toLowerCase();
				let real = check.real.trim().toLowerCase();
				if (user === real){
					score++;
					log(` CORRECTO - LLeva ${score} aciertos.`);
					if (toBeResolved.length === 0){
						log(` No hay nada más que preguntar. Fin del juego. Aciertos: ${score}`);
						//biglog(`${score}`, 'magenta');
						resolve();
						return;
					} else {
						resolve(playOne());
						return;
					}
				} else {
					log(` INCORRECTO. Fin del juego. Aciertos: ${score}`);
					//biglog(`${score}`, 'magenta');
					resolve();
					return;
				}
			})
			.catch(Sequelize.ValidationError, error => {
				errlog('El quiz es erróneo: ');
				error.errors.forEach(({message}) => errlog(message));
			})
			.catch(error => {
				errlog(error.message);
			})
		});
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