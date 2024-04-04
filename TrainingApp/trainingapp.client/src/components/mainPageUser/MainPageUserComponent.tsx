import { useState } from "react"

import { jwtDecode } from "jwt-decode";

export default function MainPageUserController() {

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useState(() => {
		const token = localStorage.getItem('userToken');

		if (token != null ) {
			setIsLoggedIn(true)
			try {
				const decodedToken = jwtDecode(token);
				console.log(decodedToken.username);
				return decodedToken;
			} catch (error) {
				console.error('B³¹d dekodowania tokena:', error);
				return null;
			}
		}
		else {
			setIsLoggedIn(false);
			window.location.href = '/';
		}
	})

	function isTokenExpired(token: string) {
		const decodedToken = jwtDecode(token);
		const currentTime = Math.floor(Date.now() / 1000); 

		if (typeof (decodedToken.exp) != 'undefined') {
			if (decodedToken.exp < currentTime) {
				return true;
			}
		}

		return false;
	}

	function logout() {
		localStorage.removeItem('userToken');
		window.location.href = '/';
	}

	return (
		<>
			<div>Witaj </div>
			<button onClick={() => { window.location.href = "/user/UserProfile" }}>Profil</button>
			<button onClick={()=>logout()}>Wyloguj Sie</button>
		</>
	)
}