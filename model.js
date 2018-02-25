//Modelo de datos (Quizzes)
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

//Funciones de Quizzes
//CUENTA QUIZZES
exports.count = () => quizzes.length;

//AÑADE QUIZ
exports.add = (question, answer) => {
	quizzes.push({
		question: (question || "").trim(),
		answer: (answer || "").trim()
	});
};

//ACTUALIZA QUIZ
exports.update = (id, question, answer) => {
	const quiz = quizzes[id];
	if (typeof quiz == "undefined") {
		throw new Error (`El valor del parámetro id no es válido`);
	}
	quizzes.splice(id, 1, {
		question: (question || "").trim(),
		answer: (answer || "").trim()
	});
};

//DEVUELVE TODOS LOS QUIZZES
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));

//DEVUELVE UN QUIZ POR SU ID
exports.getByIndex = id => {
	const quiz = quizzes[id];
	if (typeof quiz == "undefined") {
		throw new Error (`El valor del parámetro id no es válido`);
	}
	return JSON.parse(JSON.stringify(quiz));
};

// BORRAR QUIZ POR SU ID
exports.deleteByIndex = id => {
	const quiz = quizzes[id];
	if (typeof quiz == "undefined") {
		throw new Error (`El valor del parámetro id no es válido`);
	}
	quizzes.splice(id, 1);
};
