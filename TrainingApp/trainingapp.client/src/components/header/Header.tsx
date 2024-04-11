export default function Header() {

    function logout() {
        localStorage.removeItem('userToken');
        window.location.href = '/';
    }

    return (

        <header className="header">
            <div className="logo">FitApp</div>
            <div className="welcome">Witaj</div>
            <button className="logout-button" onClick={() => logout()}>Wyloguj</button>
        </header>
    )
}