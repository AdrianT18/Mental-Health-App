import './forgottenPassword.css';
import React, {useState} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

// This is the forgotten password page. It allows the user to enter their email address and send a reset link to their email.
export default function ForgottenPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    // This function handles the submit button. It sends the email to the backend to check if the email exists in the database.
    const handleSubmit = async (e) => {
        // Prevents the page from refreshing.
        e.preventDefault();
        // Sends the email to the backend to check if the email exists in the database.
        try {
            const response = await axios.post('http://localhost:3001/api/users/checkingEmail', {email});
            // If the email does not exist in the database, it will display an error message.
            if (response.data.success === 0) {
                setMessage(response.data.message);
            }
            // If the email exists in the database, it will send a reset link to the email.
            else {
                setMessage("An email has been sent to reset your password.");
            }
        } catch (error) {
            setMessage("Error sending email. Please try again later.");
        }
    }

    // This is the HTML code for the forgotten password page.
    return (
        <div className="password-main">
            <form className="password-form" onSubmit={handleSubmit}>
                <h2 className="password-title">Forgot you're password?</h2>
                <h3 className="password-sub">No worries, we'll send you a reset link.</h3>
                <p className="password-label">Email</p>
                <input
                    type="text"
                    className="forgotten"
                    name="email"
                    placeholder="Your Email... "
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <div className="buttonPassword">
                    <button className="confirmBtn">Submit</button>
                    <Link to="/login" className="password-link">Back to log in</Link>
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}