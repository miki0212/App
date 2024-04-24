import { useEffect, useState } from "react";

import Navigation from "../navigation/Navigation";
import Header from "../header/Header";
import { ENDPOINT, LINK } from "../../ENDPOINTS";
import { jwtDecode } from "jwt-decode";

import './UserProfileStyle.css';
import { IUserProfileData } from "../../Interfaces/UserProfileData";
import { IDecodedToken } from "../../Interfaces/IDecodedToken";
import ExistsUserProfileComponent from "./ExistsUserProfileComponent";

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

	const [userProfileData, setUserProfileData] = useState<IUserProfileData>({
		Age: 0,
		Height: 0,
		Sex: false,
		Weight: 0,
		UserId: 0
	});

	const [errorProfile, setErrorProfile] = useState(false);
	const [errorLoginMessage, setErrorLoginMessage] = useState("");
	const [responseServerMessage, setResponseServerMessage] = useState("");
	const [existsProfile, setExistsProfile] = useState("null");

	//const [decodedToken, setDecodedToken] = useState<IDecodedToken>();

	useEffect(() => {
		const token = localStorage.getItem('userToken');

		if (token != null) {
			try {
				const decodedToken = jwtDecode(token);
				console.log(decodedToken);
				//setDecodedToken(decodedToken as IDecodedToken);
				profilIsSet(decodedToken.id);
				console.log(decodedToken.username);
			} catch (error) {
				console.error('B³¹d dekodowania tokena:', error);
			}
		}
		else {
			window.location.href = '/';
		}
	},[])


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

	//useEffect(() => {
	//	const fetchData = async () => {
	//		const existsProfile = await profilIsSet("2");
	//		setExistsProfile(existsProfile);
	//	};

	//	fetchData();
	//})

	async function profilIsSet(userId: string) {
		const url = new URL(`${LINK}${ENDPOINT.USERDATA.GETPROFILEDATA.replace("{userId}", userId)}`);

		await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': "*"
			},
		}).then(response => {
		
			if (response.status === 400) {
				setErrorProfile(true)
				setResponseServerMessage("Wyst¹pi³ b³¹d serwera");
				throw new Error('Network response was not ok');
			}

			if (response.status === 204) {
				setExistsProfile("false");
				return null;
			}
	
			return response.json();

			
		}).then(data => {
				console.log("TestV2")
				if (data == null) {
					setExistsProfile("false");
					//console.log(existsProfile);
					return null;
				}
				setExistsProfile("true");
			setUserProfileData(data as IUserProfileData);
			console.log("UserData : ");
				console.log(data);
				setResponseServerMessage(data);
				return data;
			})
			.catch(() => {
				setErrorProfile(true)
				setResponseServerMessage("Wyst¹pi³ b³¹d serwera");
			});
		return false;
	}

	return (
		<div className="container-user-profile">
			{existsProfile == "null" ?
				<>Loading ...</> :
				existsProfile == "true" ?
					<ExistsUserProfileComponent userProfileData={userProfileData} />
					:
					<form className="user-profile-form">
						<h2>Profil Uzytkownika</h2>

						<div className="user-profile-label">
							<label>
								Waga (kg):
							</label>
							<input type="number" name="Weight" value={profile.Weight} onChange={handleChange} className="input" />
							<div>
								{errors.weight && <div style={{ color: "red" }}>{errors.weight}</div>}
							</div>
						</div>
						<div className="user-profile-label">
							<label>
								Wiek:
							</label>
							<input type="number" name="Age" value={profile.Age} onChange={handleChange} className="input" />
							<div>
								{errors.age && <div style={{ color: "red" }}>{errors.age}</div>}
							</div>
						</div>
						<div className="user-profile-label">
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
						<div className="user-profile-label">
							<label>
								Wzrost (cm):

							</label>
							<input type="number" name="Height" value={profile.Height} onChange={handleChange} className="input" />
							<div>
								{errors.weight && <div style={{ color: "red" }}>{errors.weight}</div>}
							</div>
						</div>
						<button onClick={handleSubmit} type="submit" className="user-proifle-button">Zapisz profil</button>
					</form>
			}
		</div>
	);
};