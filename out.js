//Manejadores de texto

//Requires iniciales
const figlet = require('figlet');
const chalk = require('chalk');

//COLOREAR
const colorize = (msg, color) => {
	if (typeof color !== "undefined") {
		msg = chalk[color].bold(msg);
	}
	return msg;
};

//TEXTO POR PANTALLA
const log = (msg, color) => {
	console.log(colorize(msg, color));
};

//TEXTO GRANDE POR PANTALLA
const biglog = (msg, color) => {
	log(figlet.textSync(msg, {horizontalLayout: 'full'}), color)
};

//TEXTO DE ERROR POR PANTALLA
const errlog = (emsg) => {
	console.log(`${colorize("Error", "red")}: ${colorize(colorize(emsg, "red"), bgYellowBright)}`);
};

//Funciones a exportar
exports = module.exports = {
	colorize,
	log,
	biglog,
	errlog
};