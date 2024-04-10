//import { useState } from "react"

//import { jwtDecode } from "jwt-decode";

//export default function MainPageUserController() {

//	const [isLoggedIn, setIsLoggedIn] = useState(false);

//	useState(() => {
//		const token = localStorage.getItem('userToken');

//		if (token != null ) {
//			setIsLoggedIn(true)
//			try {
//				const decodedToken = jwtDecode(token);
//				console.log(decodedToken.username);
//				return decodedToken;
//			} catch (error) {
//				console.error('B³¹d dekodowania tokena:', error);
//				return null;
//			}
//		}
//		else {
//			setIsLoggedIn(false);
//			window.location.href = '/';
//		}
//	})

//	function isTokenExpired(token: string) {
//		const decodedToken = jwtDecode(token);
//		const currentTime = Math.floor(Date.now() / 1000);

//		if (typeof (decodedToken.exp) != 'undefined') {
//			if (decodedToken.exp < currentTime) {
//				return true;
//			}
//		}

//		return false;
//	}

//	function logout() {
//		localStorage.removeItem('userToken');
//		window.location.href = '/';
//	}

//	return (
//		<>
//			<div>Witaj </div>
//			<button onClick={() => { window.location.href = "/user/UserProfile" }}>Profil</button>
//			<button onClick={()=>logout()}>Wyloguj Sie</button>
//		</>
//	)
//}



import React from 'react';
import Navigation from '../navigation/Navigation';
import Header from '../header/Header';

interface MainPageUserControllerProps {
    username: string;
}

const MainPageUserController: React.FC<MainPageUserControllerProps> = ({ username }) => {
    return (
        <div className="main-container">
            <Header></Header>
            <Navigation></Navigation>

            <div className="components-container">
                <div className="component" id="component-1">Komponent 1</div>
                <div className="component" id="component-2">Komponent 2</div>
                <div className="component" id="component-3">Komponent 3</div>
            </div>
        </div>
    );
};

export default MainPageUserController;
