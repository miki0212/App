import IAnswerMessage from '../../Interfaces/IAnswerMessage';
import INewUser from '../../Interfaces/INewUser';
import { validateNewUser } from '../Validation/ValidateUser';
import './RegisterComponentStyle.css';
import { useState } from 'react';

export default function RegisterComponent() {

	const [login, setLogin] = useState('');
	const [imie, setImie] = useState('');
	const [nazwisko, setNazwisko] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [errorLogin, setErrorLogin] = useState(false);
	const [errorLoginMessage, setErrorLoginMessage] = useState("");

	const [errorName, setErrorName] = useState(false);
	const [errorNameMessage, setErrorNameMessage] = useState("");

	const [errorLastname, setErrorLastname] = useState(false);
	const [errorLastnameMessage, setErrorLastnameMessage] = useState("");

	const [errorEmail, setErrorEmail] = useState(false);
	const [errorEmailMessage, setErrorEmailMessage] = useState("");

	const [registerSuccess, setRegisterSuccess] = useState(null);
	const [showRegisterMessage, setShowRegisterMessage] = useState(false);

	const [errorPassword, setErrorPassword] = useState(false);
	const [errorPasswordMessage, setErrorPasswordMessage] = useState("");



	async function registerUser() {


		let user: INewUser = {
			Login: login,
			Imie: imie,
			Nazwisko: nazwisko,
			Email: email,
			Haslo: password
		}

		var validateLogin: IAnswerMessage[] = validateNewUser(user);

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



		if (flag) {

			const url = new URL('https://localhost:44301/User');
			url.searchParams.append('login', login);
			url.searchParams.append('password', password);
			url.searchParams.append('imie', imie);
			url.searchParams.append('nazwisko', nazwisko);
			url.searchParams.append('email', email);

			await fetch(url, {
				method: 'POST',
				headers: {
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': "*"
					}
				},
			})
				.then(response => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					return response.json();
				})
				.then(data => {
					setShowRegisterMessage(true);
					setRegisterSuccess(data);
					return data;
				})
				.catch(error => {
					console.error('There was a problem with your fetch operation:', error);
				});
		}
	}

	return (
		<div>
			<div className="container-register">
				<h1>Rejestracja</h1>
				<div className={`input-element-register`} >
					<label>Login</label>
					<input type="text" className={`${errorLogin ? 'error-border' : 'normal-border-input-register '}`} max="50" value={login} onChange={(e) => setLogin(e.target.value)} />
					{errorLogin ? <div className="error-message">{errorLoginMessage}</div> : <></>}
				</div>

				<div className="input-element-register">
					<label>Imie</label>
					<input type="text" max="50" value={imie} onChange={(e) => setImie(e.target.value)} />
					{errorName ? <div className="error-message">{errorNameMessage}</div> : <></>}
				</div>

				<div className="input-element-register">
					<label>Nazwisko</label>
					<input type="text" max="50" value={nazwisko} onChange={(e) => setNazwisko(e.target.value)} />
					{errorLastname ? <div className="error-message">{errorLastnameMessage}</div> : <></>}
				</div>

				<div className="input-element-register">
					<label>Email</label>
					<input type="email" max="150" value={email} onChange={(e) => setEmail(e.target.value)}  />
					{errorEmail ? <div className="error-message">{errorEmailMessage}</div> : null}
				</div>

				<div className="input-element-register">
					<label>Haslo</label>
					<input type="password" max="50" value={password} onChange={(e) => setPassword(e.target.value)}  />
					{errorPassword && <div className="error-message">{errorPasswordMessage}</div>}
				</div>


				<div className="input-element-register">
					<button onClick={registerUser} type="submit">Rejestracja</button>
				</div>

				<div className="register-message">
					{showRegisterMessage ? registerSuccess ? <div>Dodano uzytkownika</div> : <div>Podany uzytkownik jest zarejestrowany</div> : <></>}
				</div>


			</div>
		</div>
	);

}