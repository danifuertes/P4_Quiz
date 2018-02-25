//Requires iniciales
const readline = require('readline');
const model = require('./model');
const {log, biglog, errlog, colorize} = require('./out');
const cmds = require('./cmds');

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
		cmds.helpCmd(rl);
      break;

  	case 'list':
  		cmds.listCmd(rl);
  		break;

	case 'show':
  		cmds.showCmd(args[1], rl);
  		break;

	case 'add':
  		cmds.addCmd(rl);
  		break;

	case 'delete':
  		cmds.deleteCmd(args[1], rl);
  		break;

	case 'edit':
  		cmds.editCmd(args[1], rl);
  		break;

	case 'test':
  		cmds.testCmd(args[1], rl);
  		break;

	case 'play':
	case 'p':
  		cmds.playCmd(rl);
  		break;

	case 'credits':
  		cmds.creditsCmd(rl);
  		break;

	case 'quit':
	case 'q':
  		cmds.quitCmd(rl);
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