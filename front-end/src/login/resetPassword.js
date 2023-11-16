import React, {useState} from 'react';
import axios from 'axios';
import './resetStyle.css'
import {Link} from "react-router-dom";

// This is the reset password page, where the user can reset their password from the email link
export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const emailToken = window.location.pathname.split('/').pop();

    // This function handles the submission of the form, and sends the new password to the backend
    const handleSubmit = async (e) => {
        // Prevents the page from refreshing
        e.preventDefault();
        // Checks if the passwords match
        if (password !== passwordConfirm) {
            // If they don't match, an error message is displayed
            setError("Passwords do not match");
            return;
        }
        // If they do match, the password is sent to the backend
        try {
            // The email token is retrieved from the url
            const {data} = await axios.patch(`http://localhost:3001/api/users/reset-password/${emailToken}`, {
                password
            });
            // If the password is successfully reset, a success message is displayed
            setSuccess(data.message);
        } catch (err) {
            setError(err.response.data.message);
        }
    };
    return (
        <div className="password-main">
            <form className="password-form" onSubmit={handleSubmit}>
                <h2 className="password-title">Reset Your Password Here</h2>
                <h3 className="password-sub">No worries, we'll sort everything out for you</h3>
                <p className="password-label">New Password</p>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <p className="password-label">Confirm Password</p>
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    required
                />
                <div className="buttonPassword">
                    <button className="confirmBtn">Submit</button>
                    <Link to="/login" className="password-link">Back to log in</Link>
                </div>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {success && <p style={{color: 'white'}}>{success}</p>}
            </form>
        </div>
    );
}