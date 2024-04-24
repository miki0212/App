import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

import "./HeaderStyle.css";

export default function Header() {

    function logout() {
        localStorage.removeItem('userToken');
        window.location.href = '/';
    }

    const [isLogged, setIsLogged] = useState(false);
    const [userLogin, setUserLogin] = useState('');


    useEffect(() => {
        const token = localStorage.getItem('userToken');

        if (token != null) {
            setIsLogged(true);
            try {
                const decodedToken = jwtDecode(token);
                setUserLogin(decodedToken.username);
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