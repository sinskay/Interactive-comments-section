import Comment from "./Comment"
import JsonData from "../assets/data.json"
import { useEffect, useState } from "react"





export default function DisplayAllComments(){
    const [render,setRender] = useState(false);

    const CurrentUser = {
        username: JsonData.currentUser.username,
        image: JsonData.currentUser.image.png
    }
      
    useEffect(()=>{
        const handleReRender = ()=>{
            setRender(true);
        }
        
        window.addEventListener('storage', handleReRender);
        return ()=>{
            window.removeEventListener('storage', handleReRender);
        }
    },[])
    
    const comments = JSON.parse(localStorage.getItem("comments"));

    return (
        
        <div className="mt-5 px-3">
            {

                comments?.map((comment,key)=>{

                    if (comment.replies.length > 0){
                        return (
                            <>
                                <Comment key={key}
                                    score={comment.score}
                                    avatartUrl={comment.user.image.png2}
                                    isOwner={(CurrentUser.username === comment.user.username)}
                                    commentedA={comment.createdAt}
                                    // replyingTo={}
                                    commentContent={comment.content}
                                    name={comment.user.username}
                                />
                                
                                {
                                    comment.replies.map((reply,i)=>{
                                        return (
                                        <div className="commentReply" key={i}>
                                            <Comment
                                            score={reply.score}
                                            avatartUrl={reply.user.image.png2}
                                            isOwner={(CurrentUser.username === reply.user.username)}
                                            commentedA={reply.createdAt}
                                            replyingTo={reply.replyingTo}
                                            commentContent={reply.content}
                                            name={reply.user.username}
                                        />
                                        </div>
                                        )


                                    })
                                }
                                
                        </>  
                          
                          
                          
                          )
                        
                    }else {
                        return <Comment 
                            key={comment.id}
                            score={comment.score}
                            avatartUrl={comment.user.image.png2}
                            isOwner={(CurrentUser.username === comment.user.username)}
                            commentedA={comment.createdAt}
                            commentContent={comment.content}
                            name={comment.user.username}
                        />
                    }

                })
            }
        </div>
    )

    

}