import IAnswerMessage from "../../Interfaces/IAnswerMessage";
import INewUser from "../../Interfaces/INewUser";


export function validateNewUser(user: INewUser): IAnswerMessage[] {
	var message: IAnswerMessage[] = [];

	message.push(validateLogin(user.Login));
	message.push(validateName(user.Imie));
	message.push(validateLastname(user.Nazwisko));

	return message;
}

function validateLogin(login: string): IAnswerMessage {
	let message: IAnswerMessage = {
		isError: false,
		message: ''
	}

	if (login.length == 0) {
		message.isError = true;
		message.message = "Podaj login"
		return message;
	}

	if (login.length < 4) {
		message.isError = true;
		message.message = "Podany login jest za krótki (min 4 znaki !!!)"
		return message;
	} else if (login.length > 16) {
		message.isError = true;
		message.message = "Podany login jest za d³ugi (max 16 znaków !!!)"
		return message;
	}

	const regex = /^[a-zA-Z0-9]+$/;
	if (regex.test(login)) {
		return message;
	} else {
		message.isError = true;
		message.message = "Podany login zawiera niedozwolone znaki !!!"
		return message;
	}
}

function validateName(imie: string): IAnswerMessage {
	let message: IAnswerMessage = {
		isError: false,
		message: ''
	}

	if (imie.length == 0) {
		message.isError = true;
		message.message = "Podaj imiê";
		return message;
	}

	if (imie.length < 2) {
		message.isError = true;
		message.message = "Podane imiê jest za krótkie (min 2 znaki !!!)";
		return message;
	}

	if (imie.length > 50) {
		message.isError = true;
		message.message = "Podane imiê jest za d³ugie (max 50 znaków !!!)";
		return message;
	}

	const regex = /^[a-zA-Z]+$/;
	if (regex.test(imie)) {
		return message;
	} else {
		message.isError = true;
		message.message = "Imiê zawiera niedozwolone znaki !!!";
		return message;
	}
}

function validateLastname(nazwisko: string): IAnswerMessage {
	let message: IAnswerMessage = {
		isError: false,
		message: ''
	}

	if (nazwisko.length == 0) {
		message.isError = true;
		message.message = "Podaj nazwisko !!!";
		return message;
	}

	if (nazwisko.length < 2) {
		message.isError = true;
		message.message = "Podane nazwisko jest za krótkie (min 2 znaki !!!)";
		return message;
	}

	if (nazwisko.length > 50) {
		message.isError = true;
		message.message = "Podane nazwisko jest za d³ugie (max 50 znaków !!!)";
		return message;
	}

	const surnameRegex = /^[a-zA-Z¹æê³ñóœŸ¿¥ÆÊ£ÑÓŒ¯]+(?:[-\s][a-zA-Z¹æê³ñóœŸ¿¥ÆÊ£ÑÓŒ¯]+)*$/;

	if (surnameRegex.test(nazwisko)) {
		return message;
	} else {
		message.isError = true;
		message.message = "Nazwisko zawiera niedozwolone znaki !!!";
		return message;
	}
}