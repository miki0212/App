import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

import "./HeaderStyle.css";
import { IDecodedToken } from "../../Interfaces/IDecodedToken";
import DecodedTokenProperties from "../../helper/DecodedToken";

export default function Header() {

    function logout() {
        localStorage.removeItem('userToken');
        window.location.href = '/';
    }

    const [isLogged, setIsLogged] = useState(false);
    const [userLogin, setUserLogin] = useState('');


    useEffect(() => {
        const token: IDecodedToken = DecodedTokenProperties();

        if (token != null && window.location.href !== 'https://localhost:5173/' && window.location.href !== 'https://localhost:5173/admin/login') {
            setIsLogged(true);
            try {
                setUserLogin(token.login);
            } catch (error) {
                console.error('B³¹d dekodowania tokena:', error);
            }
        }
        else {
            setIsLogged(false);
        }
    })

    return (
        <>
            {isLogged ? 
            <header className="header">
                    <div className="logo">FitApp</div>
                    <div className="welcome">Witaj {userLogin}</div>
                <button className="logout-button" onClick={() => logout()}>Wyloguj Sie</button>
            </header>
            :
                <></>
            }
        </>
    )
}