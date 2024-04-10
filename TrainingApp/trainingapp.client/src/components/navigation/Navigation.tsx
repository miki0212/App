export default function Navigation() {
    return (

        <nav className="navigation">
            <ul>
                <li><button onClick={() => { window.location.href = "/user/UserMainPage" }}>Strona Glowna</button></li>
                <li><button onClick={() => { window.location.href = "/user/UserProfile" }}>Profil</button></li>
                <li><button>Posilki</button></li>
                <li><button>Cwiczenia</button></li>
             
            </ul>
        </nav>
    )
}