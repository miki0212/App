import './RegisterComponentStyle.css';
import { useState } from 'react';

export default function RegisterComponent() {

	const [login, setLogin] = useState('');
	const [imie, setImie] = useState('');
	const [nazwisko, setNazwisko] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');


	async function registerUser() {
		const url = new URL('https://localhost:7087/User');
		url.searchParams.append('login', login);
		url.searchParams.append('password', password);

		await fetch(url, {
			method: 'POST',
			headers: {
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*" // Zmodyfikuj to, aby pasowa³o do adresu Twojej aplikacji frontendowej
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
				console.log(data);
			})
			.catch(error => {
				console.error('There was a problem with your fetch operation:', error);
			});
	}

	return (
		<div>
			<div className="container-register">
				<h1>Rejestracja</h1>
				<div className="input-element-register">
					<label>Login</label>
					<input type="text" max="50" value={login} onChange={(e) => setLogin(e.target.value)} />
				</div>
				<div className="input-element-register">
					<label>Imie</label>
					<input type="text" max="50" value={imie} onChange={(e) => setImie(e.target.value)} />
				</div>
				<div className="input-element-register">
					<label>Nazwisko</label>
					<input type="text" max="50" value={nazwisko} onChange={(e) => setNazwisko(e.target.value)} />
				</div>
				<div className="input-element-register">
					<label>Email</label>
					<input type="email" max="150" value={email} onChange={(e) => setEmail(e.target.value)} />
				</div>

				<div className="input-element-register">
					<label>Haslo</label>
					<input type="password" max="150" value={password} onChange={(e) => setPassword(e.target.value)} />
				</div>

				<div className="input-element-register">
					<button onClick={registerUser} type="submit">Rejestracja</button>
				</div>


			</div>
		</div>
	);

}