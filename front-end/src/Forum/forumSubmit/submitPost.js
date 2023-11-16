import { useEffect, useState } from "react";
import "./forumSubmitStyling.css";
import axios from "axios";
import authHeader from "../../authentication/auth.header";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert"

export default function SubmitPost() {
  const [titleChars, setTitleChars] = useState(100);
  const [title, setTitle] = useState("");
  const [postChars, setPostChars] = useState(2000);
  const [post, setPost] = useState("");
  const [titleColour, setTitleColour] = useState({ color: "#28c864" });
  const [bodyColour, setBodyColour] = useState({ color: "#28c864" });
  const [postText, setPostText] = useState(
      "The body of your post, with a maximum of 2000 characters"
  );
  const [titleText, setTitleText] = useState(
      "A concise and meaningful title..."
  );
  const [postBorder, setPostBorder] = useState("#ccc");
  const [titleBorder, setTitleBorder] = useState("#ccc");
  const [posterUserName,setPosterUsername] = useState("")

  let navigate = useNavigate()


  useEffect(() =>{ // fetches user's name from new API
    axios.get("http://localhost:3001/api/forumPost/getUser/", {headers: authHeader()}).then(r => setPosterUsername(r.data.data));
  },[])

  useEffect(() => {
    setTitleChars(100 - title.length);
    if (title.length >= 80) {
      setTitleColour({ color: "#ff0202" });
    } else if (title.length >= 40) {
      setTitleColour({ color: "#ffcd00" });
    } else {
      setTitleColour({ color: "#28c864" });
    }
  }, [title]);

  useEffect(() => {
    setPostChars(2000 - post.length);
    if (post.length >= 1700) {
      setBodyColour({ color: "#ff0202" });
    } else if (post.length >= 1300) {
      setBodyColour({ color: "#ffcd00" });
    } else {
      setBodyColour({ color: "#28c864" });
    }
  }, [post]);

  const submitData = async () => {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var datePosted = `${day}/${month}/${year}`;

    const trimmedPost = post.trim() // trimming post to remove excess whitespace, avoids massive post spam.

    try {
      const response = await axios.post("http://localhost:3001/api/forumPost", {
        title: title,
        content: trimmedPost,
        datePosted: datePosted,
        posterName: posterUserName
      }, { headers: authHeader() }); // requires user to login to post
      if (response) {
        swal({
          title:"Post Submitted!",
          text: "Redirecting...",
          icon:"success",
          button:false
        })
        setTimeout(() =>{ // setting a sleep timer before redirecting user, as instantly redirecting them felt confusing.
              swal.close();
              navigate("/forum/displayPost/"+response.data.data[0].insertId)}, // gets the insertID from response from server. Probably a better way to do this.
            1000)
      }
    }
    catch (error) {
      if(error.response.status === 403){
        alert("Please login before submitting a post")
      }

      else{
        alert("An unknown error occurred trying to submit your post.")
      }
    }
  };

  const checkData = (e) => {
    e.preventDefault();
    if (titleChars === 100) {
      setTitleText("Your title cannot be empty!");
      setTitleBorder("#ff0000");
    } else if (postChars === 2000) {
      setPostText("Your post content cannot be empty!");
      setPostBorder("#ff0000");
    } else {
      submitData()
    }
  };

  return (
      <main className="forumMain">
        <form className={"submitForm"}>
          <h1>Forum submit</h1>
          <label className="ForumSubmitLabel">
            Post Title (<span style={titleColour}>{titleChars} </span> chars remaining)
          </label>
          <textarea
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              id="postTitle"
              placeholder={titleText}
              style={{ borderColor: titleBorder }}
              onClick={() => {
                setTitleText("A concise and meaningful title...");
                setTitleBorder("#ccc");
              }}/>
          <label className="ForumSubmitLabel">
            Post Text (<span style={bodyColour}>{postChars} </span> characters
            remaining)
          </label>
          <textarea
              onChange={(e) => setPost(e.target.value)}
              maxLength={2000}
              id="postBody"
              placeholder={postText}
              style={{ borderColor: postBorder }}
              onClick={() => {
                setPostText(
                    "The body of your post, with a maximum of 2000 characters"
                );
                setPostBorder("#ccc");
              }}/>
          <button className="forumSubmit" onClick={checkData}>
            Submit
          </button>
        </form>
      </main>
  );
}
