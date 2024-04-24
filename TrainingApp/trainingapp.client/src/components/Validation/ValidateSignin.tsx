import IAnswerMessage from "../../Interfaces/IAnswerMessage";
import { IUserCredentials } from "../../Interfaces/IUserCredentials";

export function validateUserCredentials(user: IUserCredentials): IAnswerMessage[] {
	const messages: IAnswerMessage[] = [];
	messages.push(validateLogin(user.login));
	messages.push(validatePassword(user.password));

	return messages;
}

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

	const regex = /^[a-zA-Z0-9]+$/;
	if (!regex.test(login)) {
		message.isError = true;
		message.message = "Login zawiera niedozwolone znaki !!!";
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

	return message;
}