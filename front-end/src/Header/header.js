import { Link } from "react-router-dom";
import './headerStyle.css'
import {useEffect, useState} from "react";
import AuthService from "../authentication/auth.service";
import {useNavigate} from "react-router";

export default function HomePageHeader(){

    const [currentUser, setCurrentUser] = useState(undefined);
    const navigate = useNavigate();
    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const logout = () => {
      try {
        AuthService.logout();
        navigate("/");
        window.location.reload();
      }
      catch (e) {
        console.log(e)
      }
    }

    return (
        <>
            <header className="container-header">
                <Link to = "/" className="logo">
                    Mental Health
                </Link>
                <nav className="Header_info">
                    <div className={"links"}>
                        <Link to="/Forum" className={"landing-lbl"}>Forum</Link>
                        <Link to="/Mood" className={"landing-lbl"}>Mood Tracker</Link>
                        <Link to="/condition" className={"landing-lbl"}>Condition Search</Link>
                        <Link to="/checklist" className={"landing-lbl"}>Checklist</Link>
                    </div>
                </nav>
                <div className="login-system-land">
                    {!currentUser && (
                    <Link to="/register" className={"landing-register-label"}>Register</Link>)}
                    {!currentUser && (
                    <Link to="/login" className={"landing-login-label"}>Login</Link>)}
                    {currentUser && (
                        <button className="landing-logout-button" onClick={logout}>Logout</button>
                    )}

                </div>
            </header>
        </>
    );
}
