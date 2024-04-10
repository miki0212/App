import { useState } from "react";
import './UserProfileStyle.css'; // Upewnij siê, ¿e œcie¿ka do pliku CSS jest poprawna
import { error } from "console";
import Navigation from "../navigation/Navigation";
import Header from "../header/Header";

export default function UserProfileComponent() {
	const [profile, setProfile] = useState({
		weight: '',
		age: '',
		gender: '',
		height: '',
	});

	

	//const [errors, setErrors] = useState({});
	const [errors, setErrors] = useState({
		weight: '',
		age: '',
		gender: '',
		height: '',
	});


	const validateForm = () => {
		let formIsValid = true;
		//let errors = {};

		if (!profile.weight || profile.weight <= 0 || profile.weight >= 799) {
			errors.weight = "Podaj prawid³ow¹ wagê.";
			formIsValid = false;
		}

		if (!profile.age || profile.age <= 0 || profile.age >= 150) {
			errors.age = "Podaj prawid³owy wiek.";
			formIsValid = false;
		}

		if (!profile.gender) {
			errors.gender = "Wybierz p³eæ.";
			formIsValid = false;
		}

		if (!profile.height || profile.height <= 0 || profile.height >= 300) {
			errors.height = "Podaj prawid³owy wzrost.";
			formIsValid = false;
		}
		setTimeout(() => { },200)
		console.log(errors.weight)
		setErrors(errors);
		return formIsValid;
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("ASDAS")

		if (!validateForm()) {
			console.log('Walidacja nie powiod³a siê.');
			return;
		}

		console.log('Profil u¿ytkownika:', profile);
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setProfile((prevProfile) => ({
			...prevProfile,
			[name]: value,
		}));
	};

	//const handleSubmit = (event) => {
	//	event.preventDefault();
	//	console.log('Profil u¿ytkownika:', profile);
	//};

	return (
		<div className="main-container">

			<Header/>
			<Navigation/>
			<form onSubmit={handleSubmit} className="form">
				<h2>Profil Uzytkownika</h2>

				<div className="label">
					<label>
						Waga (kg):
					</label>
					<input
						type="number"
						name="weight"
						value={profile.weight}
						onChange={handleChange}
						className="input"
					/>
					<div>
						{errors.weight !== null ? errors.weight : ''}
					</div>
				</div>
				<div className="label">
					<label>
						Wiek:
					</label>
					<input
						type="number"
						name="age"
						value={profile.age}
						onChange={handleChange}
						className="input"
					/>
				</div>
				<div className="label">
					<label>
						Plec:
					</label>
					<select name="gender" value={profile.gender} onChange={handleChange} className="select">
						<option value="">Wybierz...</option>
						<option value="male">Mezczyzna</option>
						<option value="female">Kobieta</option>
					</select>
				</div>
				<div className="label">
					<label>
						Wzrost (cm):

					</label>
					<input
						type="number"
						name="height"
						value={profile.height}
						onChange={handleChange}
						className="input"
					/>
				</div>
				<button type="submit" className="button">Zapisz profil</button>
				{errors.weight && <div style={{ color: "red" }}>{errors.weight}</div>}
			</form>
		</div>
	);
};