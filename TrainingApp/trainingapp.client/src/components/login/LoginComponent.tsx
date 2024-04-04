import { useState } from "react"
import { IUserCredentials } from "../../Interfaces/IUserCredentials";
import IAnswerMessage from "../../Interfaces/IAnswerMessage";
import { validateUserCredentials } from "../Validation/ValidateUser";
import { Link } from 'react-router-dom'
import  RequestMaker  from "../../Nowy folder/RequestMaker";






export default function LoginComponent() {

	const requestMaker = new RequestMaker('https://localhost:7087/');

	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");

	const [errorLogin, setErrorLogin] = useState(false);
	const [errorLoginMessage, setErrorLoginMessage] = useState("");

	const [errorPassword, setErrorPassword] = useState(false);
	const [errorPasswordMessage, setErrorPasswordMessage] = useState("");

	const [responseServerMessage, setResponseServerMessage] = useState("");

	function loginHandler(e: React.ChangeEvent): void {
		let loginValue = (e.target as HTMLInputElement).value;
		setErrorLogin(false);
		setLogin(loginValue);
	}

	function passwordHandler(e: React.ChangeEvent): void {
		let passwordValue = (e.target as HTMLInputElement).value;
		setErrorPassword(false);
		setPassword(passwordValue);
	}

	async function loginUser(){
		let userCredentials: IUserCredentials = {
			login: login,
			password: password
		}

		let flag = true;

		let messages: IAnswerMessage[] = validateUserCredentials(userCredentials);

		if (messages[0].isError) {
			setErrorLogin(messages[0].isError);
			setErrorLoginMessage(messages[0].message);
			flag = false;
		}

		if (messages[1].isError) {
			setErrorPassword(messages[1].isError);
			setErrorPasswordMessage(messages[1].message);
			flag = false;
		}

		if (flag) {
			let t = await requestMaker.post('Account/login', userCredentials);
			if (flag) {


				const url = new URL('https://localhost:7087/Account/login');

				await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': "*"
					},

					body: JSON.stringify(userCredentials)
				})
					.then(response => {
						if (response.status === 400) {
							setErrorLogin(true)
							setResponseServerMessage("Wyst�pi� b��d serwera");
							throw new Error('Network response was not ok');
						} else if (response.status === 409) {
							setErrorLogin(true);
						}

						return response.text();
					})
					.then(data => {
						console.log(data)
						localStorage.setItem('userToken', data);
						window.location.href = '/user/UserMainPage';
						//setResponseServerMessage(data);
						return data;
					})
					.catch(() => {
						setErrorLogin(true)
						setResponseServerMessage("Wyst�pi� b��d serwera");
					});
			}
		}
	}

	return (
		<div>
			
			<div className="container-register">
				<h1>Logowanie</h1>
				<div className={`input-element-register`} >
					<label>Login</label>
					<input type="text" className={`${errorLogin ? 'error-border' : 'normal-border-input-register '}`} max="50" value={login} onChange={(e) => loginHandler(e)} />
					{errorLogin ? <div className="error-message">{errorLoginMessage}</div> : <></>}
				</div>

				<div className="input-element-register">
					<label>Haslo</label>
					<input type="password" max="50" value={password} onChange={(e) => passwordHandler(e)} />
					{errorPassword && <div className="error-message">{errorPasswordMessage}</div>}
				</div>


				<div className="input-element-register">
					<button onClick={loginUser} type="submit">Logowanie</button>
				</div>

				<div className="register-message">
					{<div className={`${errorLogin ? 'error-register' : ''} register-message`}>{responseServerMessage}</div>}
				</div>
				<button className="go-to-register">
					<Link className="link" to="/register">Nie masz konta? Zaloz je</Link>
				</button>

			</div>
		</div>
	)
}