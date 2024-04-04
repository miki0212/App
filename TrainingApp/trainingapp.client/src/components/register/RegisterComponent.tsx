import IAnswerMessage from '../../Interfaces/IAnswerMessage';
import INewUser from '../../Interfaces/INewUser';
import { validateNewUser, validatePsswordR } from '../Validation/ValidateUser';
import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom'

import './RegisterComponentStyle.css';


export default function RegisterComponent() {

	const [login, setLogin] = useState('');
	const [name, setName] = useState('');
	const [lastname, setLastname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordR, setPasswordR] = useState('');

	const [errorLogin, setErrorLogin] = useState(false);
	const [errorLoginMessage, setErrorLoginMessage] = useState("");

	const [errorName, setErrorName] = useState(false);
	const [errorNameMessage, setErrorNameMessage] = useState("");

	const [errorLastname, setErrorLastname] = useState(false);
	const [errorLastnameMessage, setErrorLastnameMessage] = useState("");

	const [errorEmail, setErrorEmail] = useState(false);
	const [errorEmailMessage, setErrorEmailMessage] = useState("");

	const [errorPassword, setErrorPassword] = useState(false);
	const [errorPasswordMessage, setErrorPasswordMessage] = useState("");

	const [errorPasswordR, setErrorPasswordR] = useState(false);
	const [errorPasswordRMessage, setErrorPasswordRMessage] = useState("");


	const [responseServerMessage, setResponseServerMessage] = useState('');

	const [errorRegister, setErrorRegister] = useState(false);



	async function registerUser() {

		let user: INewUser = {
			Login: login,
			Name: name,
			Lastname: lastname,
			Email: email,
			Password: password
		}

		var validateLogin: IAnswerMessage[] = validateNewUser(user);
		var validatePassword: IAnswerMessage = validatePsswordR(password, passwordR);

		console.log(validateLogin.length)

		let flag = true;

		setErrorLogin(validateLogin[0].isError);
		if (validateLogin[0].isError) {
			flag = false;
			setErrorLoginMessage(validateLogin[0].message);
		}

		setErrorName(validateLogin[1].isError);
		if (validateLogin[1].isError) {
			flag = false;
			setErrorNameMessage(validateLogin[1].message);
		}

		setErrorLastname(validateLogin[2].isError);
		if (validateLogin[2].isError) {
			flag = false;
			setErrorLastnameMessage(validateLogin[2].message);
		}

		setErrorEmail(validateLogin[3].isError);
		if (validateLogin[3].isError) {
			flag = false;
			setErrorEmailMessage(validateLogin[3].message);
		}

		setErrorPassword(validateLogin[4].isError);
		if (validateLogin[4].isError) {
			flag = false;
			setErrorPasswordMessage(validateLogin[4].message);
		}

		setErrorPasswordR(validatePassword.isError)
		if (validatePassword.isError) {
			flag = false;
			setErrorPasswordRMessage(validatePassword.message)
		}

		if (flag) {

			const url = new URL('https://localhost:7087/Account/register');

			await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*"
				},

				body: JSON.stringify(user)
			})
				.then(response => {
					if (response.status === 400) {
						setErrorRegister(true)
						setResponseServerMessage("Wyst¹pi³ b³¹d serwera");
						throw new Error('Network response was not ok');
					} else if (response.status === 409) {
						setErrorRegister(true);
					}

					return response.text();
				})
				.then(data => {
					console.log(data)
					setResponseServerMessage(data);
					return data;
				})
				.catch(() => {
					setErrorRegister(true)
					setResponseServerMessage("Wyst¹pi³ b³¹d serwera");
				});
		}
	}

	function loginHandler(e: ChangeEvent) {
		let loginValue = (e.target as HTMLInputElement).value;
		setLogin(loginValue)
		setErrorLogin(false);
		setErrorRegister(false);
	}
	function nameHandler(e: ChangeEvent) {
		let nameValue = (e.target as HTMLInputElement).value;
		setName(nameValue)
		setErrorName(false);
		setErrorRegister(false);
	}
	function lastnameHandler(e: ChangeEvent) {
		let lastnameValue = (e.target as HTMLInputElement).value;
		setLastname(lastnameValue)
		setErrorLastname(false);
		setErrorRegister(false);
	}
	function emailHandler(e: ChangeEvent) {
		let emailValue = (e.target as HTMLInputElement).value;
		setEmail(emailValue)
		setErrorEmail(false);
		setErrorRegister(false);
	}
	function passwordHandler(e: ChangeEvent) {
		let passwordValue = (e.target as HTMLInputElement).value;
		setPassword(passwordValue)
		setErrorPassword (false);
		setErrorRegister(false);
	}
	function passwordRHandler(e: ChangeEvent) {
		let passwordRValue = (e.target as HTMLInputElement).value;
		setPasswordR(passwordRValue)
		setErrorPasswordR(false);
		setErrorRegister(false);
	}


	return (
		<div>
			<div className="container-register">
				<h1>Rejestracja</h1>
				<div className={`input-element-register`} >
					<label>Login</label>
					<input type="text" className={`${errorLogin ? 'error-border' : 'normal-border-input-register '}`} max="50" value={login} onChange={(e) => loginHandler(e)} />
					{errorLogin ? <div className="error-message">{errorLoginMessage}</div> : <></>}
				</div>

				<div className="input-element-register">
					<label>Imie</label>
					<input type="text" max="50" value={name} onChange={(e) => nameHandler(e)} />
					{errorName ? <div className="error-message">{errorNameMessage}</div> : <></>}
				</div>

				<div className="input-element-register">
					<label>Nazwisko</label>
					<input type="text" max="50" value={lastname} onChange={(e) => lastnameHandler(e)} />
					{errorLastname ? <div className="error-message">{errorLastnameMessage}</div> : <></>}
				</div>

				<div className="input-element-register">
					<label>Email</label>
					<input type="email" max="150" value={email} onChange={(e) => emailHandler(e)} />
					{errorEmail ? <div className="error-message">{errorEmailMessage}</div> : null}
				</div>
				<label></label>
				<div className="input-element-register">
					<label>Haslo</label>
					<input type="password" max="50" value={password} onChange={(e) => passwordHandler(e)} />
					{errorPassword && <div className="error-message">{errorPasswordMessage}</div>}
				</div>

				<div className="input-element-register">
					<label>Powtorz Haslo</label>
					<input type="password" max="50" value={passwordR} onChange={(e) => passwordRHandler(e)} />
					{errorPasswordR && <div className="error-message">{errorPasswordRMessage}</div>}
				</div>


				<div className="input-element-register">
					<button onClick={registerUser} type="submit">Rejestracja</button>
				</div>

				<div className="register-message">
					{<div className={`${errorRegister ? 'error-register' : ''} register-message`}>{responseServerMessage}</div>}
				</div>
				<button className="go-to-register">
					<Link className="link" to="/">Masz konto? Zaloguj sie</Link>
				</button>


			</div>
		</div>
	);

}