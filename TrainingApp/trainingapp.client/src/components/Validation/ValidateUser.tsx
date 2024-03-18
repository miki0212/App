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
		message.message = "Podany login jest za krótki (min 4 znaki !!!)";
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
		message.message = "Podane imiê jest za krótkie (min 2 znaki !!!)";
		return message;
	} else if (imie.length > 50) {
		message.isError = true;
		message.message = "Podane imiê jest za d³ugie (max 50 znaków !!!)";
		return message;
	}

	const regex = /^[a-zA-Z]+$/;
	if (!regex.test(imie)) {
		message.isError = true;
		message.message = "Imiê zawiera niedozwolone znaki !!!";
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
		message.message = "Podane nazwisko jest za krótkie (min 2 znaki !!!)";
		return message;
	} else if (nazwisko.length > 50) {
		message.isError = true;
		message.message = "Podane nazwisko jest za d³ugie (max 50 znaków !!!)";
		return message;
	}

	const surnameRegex = /^[a-zA-Z¹æê³ñóœŸ¿¥ÆÊ£ÑÓŒ¯]+(?:[-\s][a-zA-Z¹æê³ñóœŸ¿¥ÆÊ£ÑÓŒ¯]+)*$/;
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
		message.message = "Podany email jest za d³ugi (max 150 znaków !!!)";
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
		message.message = "Podane haslo jest za d³ugie (max 50 znaków !!!)";
		return message;
	}

	if (!/[A-Z]/.test(password)) {
		message.isError = true;
		message.message = "Haslo musi zawierac co najmniej jedn¹ duza litere";
		return message;
	}

	if (!/[a-z]/.test(password)) {
		message.isError = true;
		message.message = "Haslo musi zawieraæ co najmniej jedna ma³a litere";
		return message;
	}

	if (!/[0-9]/.test(password)) {
		message.isError = true;
		message.message = "Haslo musi zawierac co najmniej jedn¹ cyfre";
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
		message.message = "Podane has³a nie s¹ identyczne !!!";
		return message;
	}

	return message;
}
