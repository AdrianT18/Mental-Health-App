export default function ForumReplies({index, body, date, poster}){

    return(
        <div key={index} className="forumReply">
            <div className="forumReplyMetadata">
                <h4 className="forumReplyName">Posted by: {poster}</h4>
                <h4 className="forumReplyDate">{date}</h4>
            </div>
            <h4>{body}</h4>
        </div>
    )
}