
import image from '../images/mental-health-image.png'
import './landingStyle.css'
import {useEffect, useState} from "react";
import PostService from "../authentication/post.service";
import AuthService from "../authentication/auth.service";


export default function Landing() {
    const [username, setUsername] = useState('')
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        PostService.getForumPost()
            .then((response) => {
                    const username = response.data.data
                    setUsername(username)
                },
                (error) => {
                    console.log("Private page", error.response);
                    // Invalid token
                    // if (error.response && error.response.status === 403) {
                    //     AuthService.logout();
                    //     navigate("/login");
                    //     window.location.reload();
                    // }
                }
            );
    }, [])

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
        }
    }, []);
    return (
        <main className="landing-body">
            <div className="shape-bottom">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"
                     preserveAspectRatio="none">
                    <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="shape-fill"></path>
                </svg>
            </div>

            <div className="landing-desc">
                {currentUser && (
                    <>
                        {username ? <p className="username landing">Welcome {username}</p> : null}
                    </>
                )}
                <p className="landing-title">Mental Health App</p>
                <p>Welcome to our mental health app! Our app is designed to help you manage your mental well-being in
                    the comfort of your own home. With our app, you can access a variety of tools and resources to help
                    you improve your mood, reduce stress, and manage symptoms of mental health conditions. You can track
                    your progress, set reminders, and access helpful articles and videos. Our app is easy to use and
                    completely confidential.</p>
            </div>
            <img className="landing-img" src={image} alt="A cartoon of mental health"/>
        </main>
    )

}