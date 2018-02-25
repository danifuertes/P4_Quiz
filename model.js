//Modelo de datos (Quizzes)
const fs = require('fs');
const DB_FILENAME = "quizzes.json";

let quizzes = [
	{
		question: "Capital de Italia",
		answer: "Roma"
	},
	{
		question: "Capital de Francia",
		answer: "París"
	},
	{
		question: "Capital de España",
		answer: "Madrid"
	},
	{
		question: "Capital de Portugal",
		answer: "Lisboa"
	}
];

//Funciones de guardado de Quizzes
//CARGAR
const load = () => {
	fs.readFile(DB_FILENAME, (err, data) => {
		if (err) {
			//La primera vez no existe el fichero
			if (err.code === "ENOENT") {
				save();
				return;
			}
			throw err;
		}
		let json = JSON.parse(data);
		if (json) {
			quizzes = json;
		}
	});
};

//Guardar
const save = () => {
	fs.writeFile(DB_FILENAME,
		JSON.stringify(quizzes),
		err => {
			if (err) throw err;
		});
}

//Funciones de manejo de Quizzes
//CUENTA QUIZZES
exports.count = () => quizzes.length;

//AÑADE QUIZ
exports.add = (question, answer) => {
	quizzes.push({
		question: (question || "").trim(),
		answer: (answer || "").trim()
	});
	save();
};

//ACTUALIZA QUIZ
exports.update = (id, question, answer) => {
	const quiz = quizzes[id];
	if (typeof quiz === "undefined") {
		throw new Error (`El valor del índice no es válido`);
	}
	quizzes.splice(id, 1, {
		question: (question || "").trim(),
		answer: (answer || "").trim()
	});
	save();
};

//DEVUELVE TODOS LOS QUIZZES
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));

//DEVUELVE UN QUIZ POR SU ID
exports.getByIndex = id => {
	const quiz = quizzes[id];
	if (typeof quiz === "undefined") {
		throw new Error (`El valor del índice no es válido`);
	}
	return JSON.parse(JSON.stringify(quiz));
};

// BORRAR QUIZ POR SU ID
exports.deleteByIndex = id => {
	const quiz = quizzes[id];
	if (typeof quiz === "undefined") {
		throw new Error (`El valor del índice no es válido`);
	}
	quizzes.splice(id, 1);
	save();
};


//Carga de quizzes
load();