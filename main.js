//Requires iniciales
const readline = require('readline');
const figlet = require('figlet');
const chalk = require('chalk');

//Manejadores de texto
//COLOREAR
const colorize = (msg, color) => {
	if (typeof color !== "undefined") {
		msg = chalk[color].bold(msg);
	}
	return msg;
}

//TEXTO POR PANTALLA
const log = (msg, color) => {
	console.log(colorize(msg, color));
}

//TEXTO GRANDE POR PANTALLA
const biglog = (msg, color) => {
	log(figlet.textSync(msg, {horizontalLayout: 'full'}), color)
}

//TEXTO DE ERROR POR PANTALLA
const errlog = (emsg) => {
	console.log(`${colorize("Error", "red")}: ${colorize(colorize(emsg, "red"), bgYellowBright)}`);
}

//Mensaje inicial
biglog('CORE Quiz', 'green');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: colorize('quiz> ', 'blue'),
	completer: (line) => {
		const completions = 'h help list show add delete edit test play credits quit q'.split(' ');
		const hits = completions.filter((c) => c.startsWith(line));
		return [hits.length ? hits : completions, line];
	}
});

rl.prompt();

//Nuevo comando escrito
rl.on('line', (line) => {

	let args = line.split(" ");
	let cmd = args[0].toLowerCase().trim();

  switch (cmd) {
    case '':
    	rl.prompt();
    	break;
	case 'h':
	case 'help':
		helpCmd();
      break;

  	case 'list':
  		listCmd();
  		break;

	case 'show':
  		showCmd(args[1]);
  		break;

	case 'add':
  		addCmd();
  		break;

	case 'delete':
  		deleteCmd(args[1]);
  		break;

	case 'edit':
  		editCmd(args[1]);
  		break;

	case 'test':
  		testCmd(args[1]);
  		break;

	case 'play':
	case 'p':
  		playCmd();
  		break;

	case 'credits':
  		creditsCmd();
  		break;

	case 'quit':
	case 'q':
  		quitCmd();
  		break;

    default:
      log(`Comando desconocido: '${colorize(cmd, 'red')}'`);
      log(`Escriba '${colorize('help', 'green')}' para ver todos los comandos disponibles`);
      rl.prompt();
      break;
  }

//Salir del programa
}).on('close', () => {
  biglog('¡Hasta pronto!', 'red');
  process.exit(0);
});

//AYUDA
const helpCmd = () => {
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

// Descripción de la funciones de los comandos
//LISTAR
const listCmd = () => {
	log("Listar todos los quizzes existentes", 'red');
	rl.prompt();
};

//MOSTRAR
const showCmd = id => {
	log("Mostrar el quiz indicado", 'red');
	rl.prompt();
};

//AÑADIR
const addCmd = () => {
	log("Añadir un nuevo quiz", 'red');
	rl.prompt();
};

//BORRAR
const deleteCmd = id => {
	log("Borrar el quiz indicado", 'red');
	rl.prompt();
};

//EDITAR
const editCmd = id => {
	log("Editar el quiz indicado", 'red');
	rl.prompt();
};

//TEST
const testCmd = id => {
	log("Probar el quiz indicado", 'red');
	rl.prompt();
};


//JUGAR
const playCmd = () => {
	log("Jugar", 'red');
	rl.prompt();
};

//CRÉDITOS
const creditsCmd = () => {
	log("Autores de la práctica:", 'red');
	log("	Alexander de la Torre Astanin", 'red');
	log("	Daniel Fuertes Coiras", 'red');
  	rl.prompt();
}

//SALIR
const quitCmd = () => {
	rl.close();
}