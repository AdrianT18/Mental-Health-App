/* landing page for the forum. It displays posts fetched from database */
import "./forumLandingStyling.css"
import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom"; // this might come up as an error "unrecognised" in IDE, IDK why because it works.
import axios from "axios";
import ForumPostListElements from "./forumPostListElements";
import {nanoid} from "nanoid"

export default function Forum() {
    const [data, setData] = useState([]);
    const [isLoading,setLoading] = useState(false)
    const [currentIndex,setCurrentIndex] = useState(0)
    const [page,setPage] = useState(1)
    const [maxPage,setMaxPage] = useState(0)
    let navigate = useNavigate();

    const getData = async () => {
        setLoading(true)
        try {
            const response = await axios.get("http://localhost:3001/api/forumPost")
            //console.log(response.data.data[0])
            setData(response.data.data[0])
            setMaxPage(Math.ceil((response.data.data[0].length) /6))
            setLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    function handlePostClick(postProps){
        navigate("/forum/displayPost/"+postProps.id)
    }

    function handlePaginationIncrease(){
        if(page === maxPage){
            return
        }
        setCurrentIndex(prevState => prevState+6)
        setPage(prevState => prevState+1)
    }

    function handlePaginationDecrease(){
        if(page === 1){
            return
        }
        setCurrentIndex(prevState => prevState-6)
        setPage(prevState => prevState-1)
    }


    return (
        // below is rendered when NOT loading (When we get  more posts it will take a bit longer to fetch so we can tell user its loading)
        !isLoading?
            <main className="forumLandingMain">
                <div className="forumLandingHeader">
                    <div className="forumHeaderDiv">
                        <h1>Forum Posts</h1>
                        <button onClick={() => navigate("/Forum/Submit")} className="gotoForumSubmitButton">+ New Post</button>
                    </div>
                </div>
                <div className="forumLandingMainPosts">
                    {data.slice(currentIndex,currentIndex+6).map((props, index) => { // I came up with the pagination idea on the spot, it might not be the most efficient, maybe a method involving API could be used?
                        return (
                            /* Remember that each child in an array of elements needs to have a unique key for react to handle re-rendering!!!! I used nanoid lib for this*/
                            <div key={nanoid()} onClick={() => handlePostClick(props)}> {/* Must surround it in a div to add an onclick property, otherwise I would need to make my own onclick property.*/}
                                <ForumPostListElements index={index} props={props} onClick={() => handlePostClick()}/> {/* Rendering this more programmatically by having a separate component for each post*/}
                            </div>
                        );
                    })}
                </div>
                <div className="forumPageButtons">
                    <button className="decrementPageButton" onClick={() => handlePaginationDecrease()}>&#8249;</button>
                    <p className="forumPageText">Page: {page} of {maxPage}</p>
                    <button className="incrementPageButton" onClick={() => handlePaginationIncrease()}>&#8250;</button>
                </div>
            </main>
            // below is rendered WHEN loading
            :
            <main className="forumLandingMain">
                <div className="forumLoadingDiv">
                    <h1>Loading please wait...</h1>
                </div>
            </main>
    )

}