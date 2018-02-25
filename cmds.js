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
	log("Listar todos los quizzes existentes", 'red');
	rl.prompt();
};

//MOSTRAR
exports.showCmd = (id, rl) => {
	log("Mostrar el quiz indicado", 'red');
	rl.prompt();
};

//AÑADIR
exports.addCmd = rl=> {
	log("Añadir un nuevo quiz", 'red');
	rl.prompt();
};

//BORRAR
exports.deleteCmd = (id, rl) => {
	log("Borrar el quiz indicado", 'red');
	rl.prompt();
};

//EDITAR
exports.editCmd = (id, rl) => {
	log("Editar el quiz indicado", 'red');
	rl.prompt();
};

//TEST
exports.testCmd = (id, rl) => {
	log("Probar el quiz indicado", 'red');
	rl.prompt();
};


//JUGAR
exports.playCmd = rl => {
	log("Jugar", 'red');
	rl.prompt();
};

//CRÉDITOS
exports.creditsCmd = rl => {
	log("Autores de la práctica:", 'red');
	log("	Alexander de la Torre Astanin", 'red');
	log("	Daniel Fuertes Coiras", 'red');
  	rl.prompt();
};

//SALIR
exports.quitCmd = rl => {
	rl.close();
};