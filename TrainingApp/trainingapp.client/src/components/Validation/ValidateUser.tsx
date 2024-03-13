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
		message.message = "Podany login jest za kr�tki (min 4 znaki !!!)"
		return message;
	} else if (login.length > 16) {
		message.isError = true;
		message.message = "Podany login jest za d�ugi (max 16 znak�w !!!)"
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
		message.message = "Podaj imi�";
		return message;
	}

	if (imie.length < 2) {
		message.isError = true;
		message.message = "Podane imi� jest za kr�tkie (min 2 znaki !!!)";
		return message;
	}

	if (imie.length > 50) {
		message.isError = true;
		message.message = "Podane imi� jest za d�ugie (max 50 znak�w !!!)";
		return message;
	}

	const regex = /^[a-zA-Z]+$/;
	if (regex.test(imie)) {
		return message;
	} else {
		message.isError = true;
		message.message = "Imi� zawiera niedozwolone znaki !!!";
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
		message.message = "Podane nazwisko jest za kr�tkie (min 2 znaki !!!)";
		return message;
	}

	if (nazwisko.length > 50) {
		message.isError = true;
		message.message = "Podane nazwisko jest za d�ugie (max 50 znak�w !!!)";
		return message;
	}

	const surnameRegex = /^[a-zA-Z����󜟿��ʣ�ӌ��]+(?:[-\s][a-zA-Z����󜟿��ʣ�ӌ��]+)*$/;

	if (surnameRegex.test(nazwisko)) {
		return message;
	} else {
		message.isError = true;
		message.message = "Nazwisko zawiera niedozwolone znaki !!!";
		return message;
	}
}