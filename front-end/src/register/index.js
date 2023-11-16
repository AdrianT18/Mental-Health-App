import {useState} from "react";
import axios from "axios";
import './regStyle.css'
import swal from "sweetalert";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";

// function to register a new user
export default function RegisterUser() {
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastname] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeat, setRepeat] = useState('')
    const [message, setMessage] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const navigate = useNavigate();

    // function to check whether the password matches the repeat password
    const checkPasswords = () => {
        if (password !== repeat) {
            console.log("Passwords must be the same");
            swal("Oops!", "Passwords must be the same", "error");
            return false;
        }
        return true;
    }

    const checkPasswordLength = () => {
        if (password.length < 6) {
            swal("Oops!", "Password should be at least 6 characters long", "error");
            return false;
        }
        return true;
    };

    // function to register a new user
    const signUp = (e) => {
        // prevent the page from reloading
        e.preventDefault()
        setFormSubmitted(true);

        // check if the form is filled
        if (firstname === '' || lastname === '' || username === '' || email === '' || password === '' || repeat === '') {
            swal("Oops!", "Please fill in all the fields", "error");
            return false;
        }
        // check if the passwords match
        else if (!checkPasswords() || !checkPasswordLength()) {
            return false;
        }
        // register the user by sending a post request to the backend
        axios.post('http://localhost:3001/api/users/', {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password,
        }).then((response) => {
            // if the response is 200, redirect to the login page and display a success message
            if (response.status === 200) {
                swal({
                    title:"Registration Successful",
                    text:"Redirecting....",
                    button:false,
                    icon: "success",})
                setTimeout(()=>{
                    navigate("/login")
                    swal.close()
                },1500)
            }
            // if the response is 400, display an error message
            else {
                swal("Oops!", "An error occurred", "error");
            }
        }).catch((error) => {
            console.log(error);
            swal("Oops!", "An error occurred", "error");
        });
    }

    // function to validate the email
    const emailValidation = (e) => {
        // regular expression to validate the email
        const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
        // get the email value from the input field
        const emailValue = e.target.value
        // set the email value
        setEmail(emailValue)

        // check if the email matches the regular expression
        if (email.match(regEx)) {
            // set the message to true
            setMessage(true)
        } else {
            // set the message to false
            setMessage(false)
        }
    }

    // return the register form
    return (
        <main className="body1">
            <form className="register-Container-SignUp" id="form1">
                <label className="register-logo"><h2>Sign Up</h2></label>

                <label className="reg-lbl"> First Name </label>
                <input type="text" name="firstName" placeholder="    Your Name..." required onChange={(e) => {
                    setFirstName(e.target.value)
                }}/>

                <label className="reg-lbl"> Last Name </label>
                <input type="text" name="lastName" placeholder="  Your Last Name... " required onChange={(e) => {
                    setLastname(e.target.value)
                }}/>

                <label className="reg-lbl"> Username </label>
                <input type="text" name="username" placeholder="  Your Username... " required onChange={(e) => {
                    setUsername(e.target.value)
                }}/>

                <label className="reg-lbl"> Email Address </label>
                <input type="text" name="email address" placeholder="  Your Username... " required value={email}
                       onChange={emailValidation}/>

                <p className={
                    email.length === 0
                        ? "text-message fill-color"
                        : message
                            ? "text-message success-color"
                            : "text-message error-color"
                }>
                    {
                        email.length === 0
                            ? "Please fill in the email field"
                            : message
                                ? "The email you entered is valid"
                                : "The email you entered is invalid"
                    }
                </p>

                <label className="reg-lbl"> Password (6 Characters minimum)</label>
                <input type="password" name="password" id="password" placeholder="  Password...." required
                       onChange={(e) => {
                           setPassword(e.target.value)
                       }}
                />

                <label className="reg-lbl"> Repeat password </label>
                <input type="password" name="repeat"  placeholder="  Repeat Password...." required onChange={(e) => {
                    setRepeat(e.target.value)
                }}/>

                <div className="confirm">
                    <div className="register-SignUpBtn">
                        <button className="confirmBtn" onClick={signUp}> Register</button>
                        <Link to="/login" className="loginBtn"> Log in</Link>
                    </div>
                </div>
            </form>
            {/*<section id="bg">*/}
            {/*    <ul id="shape">*/}
            {/*        <li></li>*/}
            {/*        <li></li>*/}
            {/*        <li></li>*/}
            {/*        <li></li>*/}
            {/*        <li></li>*/}
            {/*        <li></li>*/}
            {/*        <li></li>*/}
            {/*        <li></li>*/}
            {/*    </ul>*/}
            {/*</section>*/}
        </main>
    )

}