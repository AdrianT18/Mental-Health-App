// keeping this external from index.js makes it easier to read, and changes are more localised so when you enter this
// file you can easily understand any changes directly affect the forum post list
export default function ForumPostListElements({index,props}){

    return(
        <div key={index} className="forumLandingPosts">
            <div className="forumLandingPostsTitle">
                {props.title}
            </div>
            <div className="forumLandingPostsInfo">
                <div>Posted by <span style={{color: "blue"}}> {props.posterName}</span> on <span style={{color: "blue"}}> {props.datePosted}</span></div>
            </div>
        </div>
    )
}