const readline = require('readline');

console.log("¡Bienvenido a CORE Quiz!");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: 'quiz> ',
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
      console.log(`Comando desconocido: '${cmd}'`);
      console.log("Use 'help' para ver todos los comandos disponibles");
      break;
  }

//Salir del programa
}).on('close', () => {
  console.log('¡Hasta pronto!');
  process.exit(0);
});

//AYUDA
const helpCmd = () => {
	console.log("Commandos:");
	console.log("	h|help - Muestra esta ayuda.");
	console.log("	list - Listar los quizzes existentes.");
	console.log("	show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
	console.log("	add - Añadir un nuevo quiz interactivamente.");
	console.log("	delete <id> - Borrar el quiz indicado.");
	console.log("	edit <id> - Editar el quiz indicado.");
	console.log("	test <id> - Probar el quiz indicado.");
	console.log("	p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
	console.log("	credits - Créditos.");
	console.log("	q|quit - Salir del programa.");
	rl.prompt();
};

// Descripción de la funciones de los comandos
//LISTAR
const listCmd = () => {
	console.log("Listar todos los quizzes existentes");
	rl.prompt();
};

//MOSTRAR
const showCmd = id => {
	console.log("Mostrar el quiz indicado");
	rl.prompt();
};

//AÑADIR
const addCmd = () => {
	console.log("Añadir un nuevo quiz");
	rl.prompt();
};

//BORRAR
const deleteCmd = id => {
	console.log("Borrar el quiz indicado");
	rl.prompt();
};

//EDITAR
const editCmd = id => {
	console.log("Editar el quiz indicado");
	rl.prompt();
};

//TEST
const testCmd = id => {
	console.log("Probar el quiz indicado");
	rl.prompt();
};


//JUGAR
const playCmd = () => {
	console.log("Jugar");
	rl.prompt();
};

//CRÉDITOS
const creditsCmd = () => {
	console.log("Autores de la práctica:");
	console.log("	Alexander de la Torre Astanin");
	console.log("	Daniel Fuertes Coiras");
  	rl.prompt();
}

//SALIR
const quitCmd = () => {
	rl.close();
}