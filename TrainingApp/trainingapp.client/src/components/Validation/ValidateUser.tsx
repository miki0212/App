import IAnswerMessage from "../../Interfaces/IAnswerMessage";
import INewUser from "../../Interfaces/INewUser";

function validateLogin(login: string): IAnswerMessage {
	const message: IAnswerMessage = {
		isError: false,
		message: ''
	};

	if (login.length === 0) {
		message.isError = true;
		message.message = "Podaj login";
		return message;
	}

	if (login.length < 4) {
		message.isError = true;
		message.message = "Podany login jest za kr�tki (min 4 znaki !!!)";
		return message;
	} else if (login.length > 16) {
		message.isError = true;
		message.message = "Podany login jest za dlugi (max 16 znakow !!!)";
		return message;
	}

	const regex = /^[a-zA-Z0-9]+$/;
	if (!regex.test(login)) {
		message.isError = true;
		message.message = "Podany login zawiera niedozwolone znaki !!!";
	}
	return message;
}

function validateName(imie: string): IAnswerMessage {
	const message: IAnswerMessage = {
		isError: false,
		message: ''
	};

	if (imie.length === 0) {
		message.isError = true;
		message.message = "Podaj imie";
		return message;
	}

	if (imie.length < 2) {
		message.isError = true;
		message.message = "Podane imi� jest za kr�tkie (min 2 znaki !!!)";
		return message;
	} else if (imie.length > 50) {
		message.isError = true;
		message.message = "Podane imi� jest za d�ugie (max 50 znak�w !!!)";
		return message;
	}

	const regex = /^[a-zA-Z]+$/;
	if (!regex.test(imie)) {
		message.isError = true;
		message.message = "Imi� zawiera niedozwolone znaki !!!";
	}
	return message;
}

function validateLastname(nazwisko: string): IAnswerMessage {
	const message: IAnswerMessage = {
		isError: false,
		message: ''
	};

	if (nazwisko.length === 0) {
		message.isError = true;
		message.message = "Podaj nazwisko";
		return message;
	}

	if (nazwisko.length < 2) {
		message.isError = true;
		message.message = "Podane nazwisko jest za kr�tkie (min 2 znaki !!!)";
		return message;
	} else if (nazwisko.length > 50) {
		message.isError = true;
		message.message = "Podane nazwisko jest za d�ugie (max 50 znak�w !!!)";
		return message;
	}

	const surnameRegex = /^[a-zA-Z����󜟿��ʣ�ӌ��]+(?:[-\s][a-zA-Z����󜟿��ʣ�ӌ��]+)*$/;
	if (!surnameRegex.test(nazwisko)) {
		message.isError = true;
		message.message = "Nazwisko zawiera niedozwolone znaki !!!";
	}
	return message;
}

function validateEmail(email: string): IAnswerMessage {
	const message: IAnswerMessage = {
		isError: false,
		message: ''
	};

	if (email.length === 0) {
		message.isError = true;
		message.message = "Podaj adres e-mail";
		return message;
	}

	if (email.length < 8) {
		message.isError = true;
		message.message = "Email jest za krotkie (min 8 znakow)";
		return message;
	} else if (email.length > 150) {
		message.isError = true;
		message.message = "Podany email jest za d�ugi (max 150 znak�w !!!)";
		return message;
	}


	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		message.isError = true;
		message.message = "Podany adres e-mail jest nieprawidlowy";
	}
	return message;
}

function validatePassword(password: string): IAnswerMessage {
	const message: IAnswerMessage = {
		isError: false,
		message: ''
	};

	if (password.length === 0) {
		message.isError = true;
		message.message = "Podaj haslo";
		return message;
	}

	if (password.length < 8) {
		message.isError = true;
		message.message = "Haslo jest za krotkie (min 8 znakow)";
		return message;
	} else if (password.length > 50) {
		message.isError = true;
		message.message = "Podane haslo jest za d�ugie (max 50 znak�w !!!)";
		return message;
	}

	if (!/[A-Z]/.test(password)) {
		message.isError = true;
		message.message = "Haslo musi zawierac co najmniej jedn� duza litere";
		return message;
	}

	if (!/[a-z]/.test(password)) {
		message.isError = true;
		message.message = "Haslo musi zawiera� co najmniej jedna ma�a litere";
		return message;
	}

	if (!/[0-9]/.test(password)) {
		message.isError = true;
		message.message = "Haslo musi zawierac co najmniej jedn� cyfre";
		return message;
	}

	if (!/[!@#\$%\^&\*]/.test(password)) {
		message.isError = true;
		message.message = "Haslo musi zawierac co najmniej jeden znak specjalny (!@#$%^&*)";
		return message;
	}

	return message;
}

export function validateNewUser(user: INewUser): IAnswerMessage[] {
	const messages: IAnswerMessage[] = [];

	messages.push(validateLogin(user.Login));
	messages.push(validateName(user.Name));
	messages.push(validateLastname(user.Lastname));
	messages.push(validateEmail(user.Email));
	messages.push(validatePassword(user.Password));


	return messages;
}

export function validatePsswordR(password: string, passwordR: string): IAnswerMessage {
	const message: IAnswerMessage = {
		isError: false,
		message: ''
	};

	if (password != passwordR) {
		message.isError = true;
		message.message = "Podane has�a nie s� identyczne !!!";
		return message;
	}

	return message;
}
