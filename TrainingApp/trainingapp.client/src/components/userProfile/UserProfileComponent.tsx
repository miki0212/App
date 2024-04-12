import { useState } from "react";
import './UserProfileStyle.css';
import Navigation from "../navigation/Navigation";
import Header from "../header/Header";
import { ENDPOINT, LINK } from "../../ENDPOINTS";

export default function UserProfileComponent() {
	const [profile, setProfile] = useState({
		UserId:0,
		Weight: 0,
		Age: 0,
		Sex: false,
		Height: 0,
	});

	const [errors, setErrors] = useState({
		weight: '',
		age: '',
		gender: '',
		height: '',
	});

	const [errorProfile, setErrorProfile] = useState(false);
	const [errorLoginMessage, setErrorLoginMessage] = useState("");
	const [responseServerMessage, setResponseServerMessage] = useState("");



	const validateForm = () => {
		let formIsValid = true;
		let newErrors = { ...errors };

		if (!profile.Weight || profile.Weight <= 0 || profile.Weight >= 799) {
			newErrors.weight = "Podaj prawidlowa wage.";
			formIsValid = false;
		}

		if (!profile.Age || profile.Age <= 0 || profile.Age >= 1500) {
			newErrors.age = "Podaj prawidlowy wiek.";
			formIsValid = false;
		}

		//if (!profile.Sex) {
		//	newErrors.gender = "Wybierz plec.";
		//	formIsValid = false;
		//}

		if (!profile.Height || profile.Height <= 0 || profile.Height >= 300) {
			newErrors.height = "Podaj prawidlowy wzrost.";
			formIsValid = false;
		}

		if (formIsValid) {
			var token = localStorage.getItem("userToken");
			const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");
			const decodedPayload = atob(encodedPayload);
			const payloadObject = JSON.parse(decodedPayload);
			console.log(payloadObject);
			profile.UserId = payloadObject.id;
		}

		setErrors(newErrors);
		return formIsValid;
	};

	async function handleSubmit(event) {
		event.preventDefault();
		/*let flag = validateForm();*/
		if (!validateForm()) {
			console.log('Walidacja nie powiodla sie.');
		} else {
			const url = new URL(`${LINK}${ENDPOINT.USERDATA.SETPROFILEDATA}`);

			await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': "*"
				},

				body: JSON.stringify(profile)
			})
				.then(response => {
					if (response.status === 400) {
						setErrorProfile(true)
						setResponseServerMessage("Wyst¹pi³ b³¹d serwera");
						throw new Error('Network response was not ok');
					}

					return response.text();
				})
				.then(data => {
					setResponseServerMessage(data);
					return data;
				})
				.catch(() => {
					setErrorProfile(true)
					setResponseServerMessage("Wyst¹pi³ b³¹d serwera");
				});


		}

		console.log('Profil u¿ytkownika:', profile);
		console.log('Profil u¿ytkownika:', errors);
	};

	const handleChange = (event) => {
		let { name, value } = event.target;
		if (value === "false")
			value = false;
		if (value === "true")
			value = true
		setProfile((prevProfile) => ({
			...prevProfile,
			[name]: value,
		}));
	};

	const profilIsSet = ()=>{
		return false;
	}

	return (
		<div className="main-container">
			<Header />
			<Navigation />
			{profilIsSet() ? 
			<div></div>	
		:
			<form className="form">
				<h2>Profil Uzytkownika</h2>

				<div className="label">
					<label>
						Waga (kg):
					</label>
					<input type="number" name="Weight" value={profile.Weight} onChange={handleChange} className="input" />
					<div>
						{errors.weight && <div style={{ color: "red" }}>{errors.weight}</div>}
					</div>
				</div>
				<div className="label">
					<label>
						Wiek:
					</label>
					<input type="number" name="Age" value={profile.Age} onChange={handleChange} className="input" />
					<div>
						{errors.age && <div style={{ color: "red" }}>{errors.age}</div>}
					</div>
				</div>
				<div className="label">
					<label>
						Plec:
					</label>
					<select name="Sex" value={profile.Sex} onChange={handleChange} className="select">
						<option value="">Wybierz...</option>
						<option value={"true"}>Mezczyzna</option>
						<option value={"false"}>Kobieta</option>
					</select>
					<div>
						{errors.gender && <div style={{ color: "red" }}>{errors.gender}</div>}
					</div>
				</div>
				<div className="label">
					<label>
						Wzrost (cm):

					</label>
					<input type="number" name="Height" value={profile.Height} onChange={handleChange} className="input" />
					<div>
						{errors.weight && <div style={{ color: "red" }}>{errors.weight}</div>}
					</div>
				</div>
				<button onClick={handleSubmit} type="submit" className="button">Zapisz profil</button>
			</form>
				}
		</div>
	);
};