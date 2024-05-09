import IAnswerMessage from "../../../Interfaces/IAnswerMessage";

export function validateAdminPassword(password: string): IAnswerMessage {
	const message: IAnswerMessage = {
		status: false,
		message: ''
	};

	if (password.length === 0) {
		message.status = true;
		message.message = "Podaj haslo";
		return message;
	}

	//if (password.length < 8) {
	//	message.status = true;
	//	message.message = "Haslo jest za krotkie (min 8 znakow)";
	//	return message;
	//} else if (password.length > 50) {
	//	message.status = true;
	//	message.message = "Podane haslo jest za d³ugie (max 50 znaków !!!)";
	//	return message;
	//}

	//if (!/[A-Z]/.test(password)) {
	//	message.status = true;
	//	message.message = "Haslo musi zawierac co najmniej jedn¹ duza litere";
	//	return message;
	//}

	//if (!/[a-z]/.test(password)) {
	//	message.status = true;
	//	message.message = "Haslo musi zawieraæ co najmniej jedna ma³a litere";
	//	return message;
	//}

	//if (!/[0-9]/.test(password)) {
	//	message.status = true;
	//	message.message = "Haslo musi zawierac co najmniej jedn¹ cyfre";
	//	return message;
	//}

	//if (!/[!@#\$%\^&\*]/.test(password)) {
	//	message.status = true;
	//	message.message = "Haslo musi zawierac co najmniej jeden znak specjalny (!@#$%^&*)";
	//	return message;
	//}

	return message;
}

export function validateAdminLogin(login: string): IAnswerMessage {
	const message: IAnswerMessage = {
		status: false,
		message: ''
	};

	if (login.length === 0) {
		message.status = true;
		message.message = "Podaj login";
		return message;
	}

	if (login.length < 4) {
		message.status = true;
		message.message = "Podany login jest za krotki (min 4 znaki !!!)";
		return message;
	} else if (login.length > 16) {
		message.status = true;
		message.message = "Podany login jest za dlugi (max 16 znakow !!!)";
		return message;
	}

	const regex = /^[a-zA-Z0-9]+$/;
	if (!regex.test(login)) {
		message.status = true;
		message.message = "Podany login zawiera niedozwolone znaki !!!";
	}
	return message;
}
