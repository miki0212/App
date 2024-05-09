import { useEffect, useState } from 'react'
import './NavigationComponentStyle.css'
import { NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import DecodedTokenProperties from '../../helper/DecodedToken';
import { IDecodedToken } from '../../Interfaces/IDecodedToken';
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
        const decodedToken: IDecodedToken = DecodedTokenProperties();

        if (decodedToken != null && decodedToken.accountType === 'User') {
            setIsLogged(true);
        }
        else {
            setIsLogged(false);
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