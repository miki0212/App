import { useEffect, useState } from 'react'
import './NavigationComponentStyle.css'
import { NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
//import { NavLink } from 'react-router-dom';
export default function Navigation() {
    const [actualPage, setActualPage] = useState('');
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        changeActualPage();
    }, [actualPage]);

    function checkActualPage(url: string) {
        setTimeout(() => {
        }, 10);
        if (url === actualPage) {
            return true;
        }
        return false;
    }



    const changeActualPage = () => {
        const windowURL = window.location.href;
        console.log("Window URL : " + windowURL);
        setTimeout(() => {
            setActualPage(windowURL.split('/')[4]);
        },100)
    }

    useEffect(() => {
        const token = localStorage.getItem('userToken');

        if (token != null) {
            setIsLogged(true);
            try {
                const decodedToken = jwtDecode(token);
                console.log(decodedToken.username);

                //return decodedToken;
            } catch (error) {
                console.error('B³¹d dekodowania tokena:', error);
                //return null;
            }
        }
        else {
            setIsLogged(false);
            //setIsLoggedIn(false);
            //window.location.href = '/user/UserMainPage';
        }
    })


    return (
        <>
            {isLogged ?
        <nav className="navigation">
            <ul>
                <li><NavLink className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "menu-button menu-button-choosen" : "menu-button"} to="/user/UserMainPage" >Strona Glowna</NavLink></li>
                <li><NavLink className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "menu-button menu-button-choosen" : "menu-button"} to="/user/UserProfile" >Profil</NavLink></li>

                <li><NavLink className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "menu-button menu-button-choosen" : "menu-button"} to="/user/Food" >Posilki</NavLink></li>
                <li><NavLink className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "menu-button menu-button-choosen" : "menu-button"} to="/user/Exercises" >Cwiczenia</NavLink></li>

            </ul>
                </nav>
                : <></>}
        </>
    )
}