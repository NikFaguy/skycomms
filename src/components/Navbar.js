import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useUserContext } from "../hooks/useUserContext";
import logo from "../img/skycomms_logo_vect_512.png";

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useUserContext();
    
    let statusNav = false;

    const ouvrirNav = () => {
        statusNav = true;
        document.getElementsByClassName("sidenav")[0].style.width = "250px";
        document.getElementsByClassName("menu")[0].style.opacity = "0";
        document.getElementsByClassName("menu")[0].style.pointerEvents = "none";
        document.getElementsByClassName("sidenav")[0].style.opacity = "1";
    }

    const fermerNav = () => {
        statusNav = false;
        document.getElementsByClassName("sidenav")[0].style.width = "0";
        document.getElementsByClassName("menu")[0].style.opacity = "1";
        document.getElementsByClassName("menu")[0].style.pointerEvents = "auto";
        document.getElementsByClassName("sidenav")[0].style.opacity = "0";
    }

    const handleNav = () => {
        if (!statusNav) {
            ouvrirNav();
        }
        else {
            fermerNav();
        }
    }

    window.onclick = function (event) {
        if (event.target !== document.getElementsByClassName("sidenav")[0] && event.target !== document.getElementsByClassName("menu")[0].children[0]) {
            fermerNav();
        }
    }

    const handleClick = () => {
        logout();
    };

    return (
        <header>
            <div className="container">
                <div>
                    <p id="hamburgerMenu" className="menu" onClick={handleNav}>
                        <svg width="38" height="38" viewBox="0 0 100 100">
                            <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                            <path className="line line2" d="M 20,50 H 80" />
                            <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                        </svg>
                    </p>
                    <Link to="/">
                        <img width="40" height="40" src={logo} alt="SkyComms"></img>
                    </Link>
                </div>
                {user && (
                    <button onClick={handleClick}>
                        Déconnexion
                    </button>
                )}
                {!user && (
                    <Link to="/user/login">
                        <button>
                            Connexion
                        </button>
                    </Link>
                )}
            </div>

            <nav className="sidenav">
                {user && (
                    <div className="sideNavItems">

                        <p className="closebtn" onClick={handleNav}>&times;</p>

                        <div className="mainLink">
                            <img src={logo} alt="SkyComms"></img>
                            <h1>SkyComms</h1>
                        </div>

                        <div>
                            <Link to="/" className="sideNavItem">
                                <p>Accueil</p>
                            </Link>
                        </div>

                        <div>
                            <Link to="/discussion/search" className="sideNavItem">
                                <p>Rechercher</p>
                            </Link>
                        </div>

                        <div>
                            <Link to="/discussion/create" className="sideNavItem">
                                <p>Créer une publication</p>
                            </Link>
                        </div>

                        <div>
                            <Link to="/user/profile/" className="sideNavItem">
                                <p>Mon profil</p>
                            </Link>
                        </div>
                    </div>
                )}

                {!user && (
                    <div className="sideNavItems">
                        <p className="closebtn" onClick={handleNav}>&times;</p>

                        <div>
                            <Link to="/" className="mainLink">
                                <img src={logo} alt="SkyComms"></img>
                                <h1>SkyComms</h1>
                            </Link>
                        </div>

                        <div>
                            <Link to="/user/login" className="sideNavItem">
                                <p>Connexion</p>
                            </Link>
                        </div>

                        <div className="sideNavItem">
                            <Link to="/user/signup" className="sideNavItem">
                                <p>S'inscrire</p>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
