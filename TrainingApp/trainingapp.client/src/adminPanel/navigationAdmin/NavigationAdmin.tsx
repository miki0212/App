import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react';
import DecodedTokenProperties from '../../helper/DecodedToken';
import { IDecodedToken } from '../../Interfaces/IDecodedToken';



export default function NavigationAdmin() {

    const [actualPage, setActualPage] = useState('');
    const [isLoggedAdmin, setIsLoggedAdmin] = useState(false);

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

    useEffect(() => {
        const decodedToken: IDecodedToken = DecodedTokenProperties();
        console.log(window.location.href)
        if (decodedToken != null && decodedToken.accountType === 'Admin' && window.location.href !== 'https://localhost:5173/') {
            setIsLoggedAdmin(true);
        }
        else {
            setIsLoggedAdmin(false);
        }
    })

    const changeActualPage = () => {
        const windowURL = window.location.href;
        console.log("Window URL : " + windowURL);
        setTimeout(() => {
            setActualPage(windowURL.split('/')[4]);
        }, 100)
    }
    return (
        <>
            <>
                {isLoggedAdmin ?
                    <nav className="navigation">
                        <ul>
                            <li><NavLink className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "menu-button menu-button-choosen" : "menu-button"} to="/admin/adminMainPage" >Strona Glowna</NavLink></li>
                            <li><NavLink className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "menu-button menu-button-choosen" : "menu-button"} to="/admin/AddNewAdmin" >Dodaj Admina</NavLink></li>
                            <li><NavLink className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "menu-button menu-button-choosen" : "menu-button"} to="/admin/AddNewAdmin" >Zablokuj uzytkownika</NavLink></li>
                            <li><NavLink className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "menu-button menu-button-choosen" : "menu-button"} to="/admin/addExercise" >Dodaj Cwiczenie</NavLink></li>
                            <li><NavLink className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "menu-button menu-button-choosen" : "menu-button"} to="/admin/AddNewAdmin" >Dodaj Posilek</NavLink></li>


                        </ul>
                    </nav>
                    : <></>}
            </>
        </>
    )
}