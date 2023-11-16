import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import "./postDisplayStyle.css"
import "../forumLanding/forumLandingStyling.css"
import authHeader from "../../authentication/auth.header";
import ForumReplies from "./forumReplies";
import swal from "sweetalert"

export default function ForumPostDisplay(){
    let navigate = useNavigate();
    const {id} = useParams(); // gets post ID from the URL
    const [postData, setPostData] = useState({ // initial data before fetched
        id:0,
        datePosted:1970-1-1,
        content:"",
        title:"",
    })
    const [username,setUsername] = useState("")
    const [replies,setReplies] = useState([])
    const [replyBody, setReplyBody] = useState("")
    const [replyIndex,setReplyIndex] = useState(0)
    const [totalReplyPages,setTotalReplyPages] = useState(0)
    const [currentPage,setCurrentPages] = useState(1)
    const [remainingChars,setRemainingChars] = useState(1000)
    const [remainingColor,setRemainingColor] = useState({ color: "#28c864" })
    const [invalidReply, setInvalidReply] = useState(false);

    useEffect(() => {
        const getData = async () =>{
            try {
                const {data} = await axios.get("http://localhost:3001/api/forumPost/getPost/"+id)
                setPostData(data.data)
            } catch (error) {
                console.error(error)
            }
        }
        getData()
    },[])

    useEffect(() =>{ // fetches user's name from new API
        axios.get("http://localhost:3001/api/forumPost/getUser/", {headers: authHeader()}).then(r => setUsername(r.data.data));
    },[])

    useEffect(() => { // fetches replies from DB for current postID.
        const getReplies = async () =>{
            try{
                const {data} = await axios.get("http://localhost:3001/api/replies/getRepliesFromPostID/"+id)
                setReplies(data.data)
                setTotalReplyPages(Math.ceil(data.data.length / 6))
            }
            catch (error){
                console.error(error)
            }
        }
        getReplies()
    },[])

    useEffect(() => {
        let remainingChars = 1000 - replyBody.length
        setRemainingChars(remainingChars)
        if(remainingChars <= 300){setRemainingColor({color: "#ff0202" })}
        else if(remainingChars <= 600){setRemainingColor({color: "#ff7200" })}
        else{setRemainingColor({ color: "#28c864" })}
    },[replyBody])

    const submitReply = async (e) => {
        e.preventDefault()
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var datePosted = `${day}/${month}/${year}`;

        if (replyBody.length === 0) {
            setInvalidReply(true);
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/api/replies/replyPost/", {
                id: id,
                date: datePosted,
                body: replyBody,
                postedBy:username
            })
            console.log(response)
            setReplies([{id:id,date:datePosted,body:replyBody,postedBy:username},...replies||[]]) // Adds users posted reply to list of replies without calling useEffect again.
            setReplyBody("")
        } catch (error) {
            console.error(error)
        }
    }
    const handlePagination = (increase) => {
        if(increase && currentPage < totalReplyPages){
            setCurrentPages(prevState => prevState+1)
            setReplyIndex(prevState => prevState+6)
        }
        else if(!increase && currentPage > 1){
            setCurrentPages(prevState => prevState-1)
            setReplyIndex(prevState => prevState-6)
        }
    }

    const handlePopup = () => {
        swal({
            title:"Delete Post?",
            text: "Are you sure you want to delete this post?",
            icon:"warning",
            buttons:true,
            dangerMode:true, // sets focus to cancel button.
        }).then((isDelete) =>{
            if(isDelete){
                deletePost().then((isDeleted) => {
                    if(isDeleted){
                        swal({
                            title:"Post Deleted",
                            text:"Redirecting....",
                            button:false,
                            icon: "success",})
                        setTimeout(()=>{
                            navigate("/forum/")
                            swal.close()
                        },800)
                    }
                    else{
                        swal({
                            title:"Delete Failed",
                            text:"Please try again",
                            button:"Ok",
                            icon: "warning",})
                    }
                })
            }
        })

        const deletePost = async () => {
            return await axios.get("http://localhost:3001/api/replies/deletePost/" + id);
        }
    }

    return(
        <main className="forumWrapper">
            <div className="forumPost">
                <h1>{postData.title}</h1>
                <button className="forumReturnButton" onClick={() => navigate("/forum/")} > &#8249; Return</button>
                <div className="postMetaData">
                    <h4 className="forumPostDate">Date Posted: {postData.datePosted}</h4>
                    <h4 className="forumPosterName">Posted By: {postData.posterName}</h4>
                </div>
                <hr className="divider"/>
                <pre>{postData.content}</pre>
                <div className="forumDeleteContainer">
                    {username === postData.posterName && <button onClick={() => {handlePopup()}} className="forumDeleteButton">Delete Post</button> } {/* conditionally rendering delete post button if username matches poster name */ }
                </div>
                {username.length > 0 && 
                <form className="forumReplyPost">
                    <div className="forumReplyLabel">
                       <label>Reply to this post (<span style={remainingColor}>{remainingChars} </span>chars remaining)</label> 
                       {invalidReply && <p className="forumReplyError">This cannot be empty!</p>}
                    </div>
                    <textarea maxLength={1000} value={replyBody} onChange={(e) => setReplyBody(e.target.value)} style={{ borderColor: invalidReply ? "red" : ""}} onClick={() => {setInvalidReply(false)}}/>
                    <button onClick={submitReply}>Reply</button>
                </form>
            }
            </div>
            {replies && <div className="forumReplies">
                {replies.slice(replyIndex,replyIndex+6).map((data, index) => {
                    return (
                        <ForumReplies key={index} body={data.body} date={data.date} poster={data.postedBy}/>
                    )
                })}
            </div>
            }
            {replies && <div className="forumPageButtons">
                <button className="decrementPageButton" onClick={() => handlePagination(false)}>&#8249;</button>
                <p className="forumPageText">Page: {currentPage} of {totalReplyPages}</p>
                <button className="incrementPageButton" onClick={() => handlePagination(true)}>&#8250;</button>
            </div>}
        </main>
    )
}