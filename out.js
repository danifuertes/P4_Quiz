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
const log = (socket, msg, color) => {
	socket.write(colorize(msg, color) + "\r\n");
};

//TEXTO GRANDE POR PANTALLA
const biglog = (socket, msg, color) => {
	log(socket, figlet.textSync(msg, {horizontalLayout: 'full'}), color)
};

//TEXTO DE ERROR POR PANTALLA
const errlog = (socket, emsg) => {
	socket.write(`${colorize("Error", "red")}: ${colorize(colorize(emsg, "red"), "bgYellowBright")}\r\n`);
};

//Funciones a exportar
exports = module.exports = {
	colorize,
	log,
	biglog,
	errlog
};