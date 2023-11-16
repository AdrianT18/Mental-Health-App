import {Link} from "react-router-dom";
import './loginStyle.css'
import tree from '../images/tree1.png'
import {useState} from "react";
import {useNavigate} from "react-router";
import AuthService from "../authentication/auth.service";
import swal from "sweetalert";

// This is the login page
export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // This function is called when the user clicks the login button
    const onSubmit = async (e) => {
        // Prevent the page from reloading
        e.preventDefault();
        // Call the login function from the AuthService
        try {
            // Wait for the response from the server
            const response = await AuthService.login(username, password);
            // If the response is successful, navigate to the home page
            if (response.auth) {
                // Show a success message
                swal({
                    title: "Login Successful",
                    text: "Welcome to Mental Health",
                    icon: "success",
                    buttons: false
                });
                // Navigate to home page and reload after 1 second
                setTimeout(() => {
                    navigate("/");
                    window.location.reload();
                }, 1000);
            }
            // If the response is not successful, show an error message
            else {
                swal("Login Failed", response.message, "error");
            }
        } catch (error) {
            console.error(error);
            // If there is an error, show an error message
            swal("Login Failed", "Wrong Username Or Password", "error");
        }
    };

    // This is the JSX code for the login page
    return (
        <main className="login-main">
            <form className="login-section" onSubmit={onSubmit}>
                <h3 className="login-title">Mental Health</h3>
                <p className="login-sub">Login in to explore your mental health...</p>
                <input type="text" className="login-input" name="username" placeholder="Your Username... "
                       onChange={(e) => setUsername(e.target.value)}
                       value={username}
                       required/>
                <input type="password" className="login-input" name="password"
                       placeholder="Password...."
                       onChange={(e) => setPassword(e.target.value)}
                       value={password}
                       required/>
                <button className="confirmBtn">Login</button>
                <Link to="/ForgottenPassword" className="login-link">Forgot Your Password?</Link>
                <Link to="/register" className="login-link">Dont Have An Account? Sign Up</Link>
            </form>
            <section className="login-image">
                <img src={tree} alt="tree" className="tree-image"/>
            </section>
        </main>
    )
}