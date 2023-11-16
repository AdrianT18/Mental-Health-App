import './style.css';
import './Forum/forumSubmit/forumSubmitStyling.css'
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import MoodTracker from './Mood Tracker/moodtracker';
import Landing from "./landing/landing";
import Forum from "./Forum/forumLanding";
import ConditionSearch from "./conditionsearch";
import RegisterUser from "./register";
import HomePageHeader from "./Header/header";
import SubmitPost from "./Forum/forumSubmit/submitPost";
import ForumPostDisplay from "./Forum/forumPost/forumPostDisplay";
import Login from "./login";
import ForgottenPassword from "./login/forgottenPassword";
import ResetPassword from "./login/resetPassword";
import Checklist from "./checklist/checklist";

// App is the main component that renders all other components
function App() {
    return (
        // Router is used to route to different pages
        <Router>
            <div>
                {/*Header is rendered on every page*/}
                <HomePageHeader/>
                {/*Routes is used to route to different pages*/}
                <Routes>
                    <Route exact path="/" element={<Landing/>}/>
                    <Route exact path="/condition" element={<ConditionSearch/>}/>
                    <Route exact path="/register" element={<RegisterUser/>}/>
                    <Route exact path="/login" element={<Login/>}/>
                    <Route exact path="/checklist" element={<Checklist/>}/>
                    <Route exact path="/Mood" element={<MoodTracker/>}/>
                    {/* Forum routes*/}
                    <Route exact path="/forum" element={<Forum/>}/>
                    <Route path="/forum/submit" element={<SubmitPost/>} />
                    <Route path="/forum/displayPost/:id" element={<ForumPostDisplay/>}/>{/* dynamic route */}
                    {/* dynamic route */}
                    <Route path="/forgottenPassword" element={<ForgottenPassword/>} />
                    <Route path="/api/users/reset-password/:emailToken" element={<ResetPassword/>} />
                </Routes>
            </div>
        </Router>
    )
}

export default App;
