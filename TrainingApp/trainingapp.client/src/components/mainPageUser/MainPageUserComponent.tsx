import { useState } from "react"

import { jwtDecode } from "jwt-decode";

export default function MainPageUserController() {

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useState(() => {
		const token = localStorage.getItem('userToken');

		if (token != null && isTokenExpired(token)) {
			setIsLoggedIn(true)
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

	return (
		<>
			TEST STRONY PO ZALOGOWANIU
			<button>Wyloguj Sie</button>
		</>
	)
}