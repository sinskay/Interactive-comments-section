import { useEffect, useState } from "react";
import ProfileImage from "../assets/images/avatars/image-juliusomo.png";
import JsonData from "../assets/data.json"
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';

export default function AddComment({actionName,replyingTo}){
    const [comment,setComment] = useState("");
    

    const CurrentUser = {
        username: JsonData.currentUser.username,
        image: JsonData.currentUser.image.png2
    }
    const ExistsComments = JsonData.comments;

    


    function setCommentsToLocalStorage() {  
        if(!localStorage.getItem('comments')){
            const ExistsCommentsJSON = JSON.stringify(ExistsComments);
            localStorage.setItem('comments', ExistsCommentsJSON);
            window.dispatchEvent(new Event('storage'))
        }
    }
     

    useEffect(()=>{        
        setCommentsToLocalStorage();
    },[])
    


    function setNewComment(newComments) {
        const existingCommentsJSON = localStorage.getItem('comments');
      
        if (existingCommentsJSON) {
          const existingComments = JSON.parse(existingCommentsJSON);
          existingComments.push(newComments);
          const updatedCommentsJSON = JSON.stringify(existingComments);
          localStorage.setItem('comments', updatedCommentsJSON);
          console.log('Comments updated in localStorage.');
        } else {
          const newCommentsJSON = JSON.stringify(newComments);
          localStorage.setItem('comments', newCommentsJSON);
          window.dispatchEvent(new Event('storage'));
          console.log('New comments set in localStorage.');
        }
    }


    function handleReply(){
        const comments = JSON.parse(localStorage.getItem("comments"));

        comments.map((value)=>{
            if(value.user.username === replyingTo){
                const replyObj = {
                    content: comment,
                    createdAt: "Now",
                    id: uuidv4(),
                    replyingTo: replyingTo,
                    score: 0,
                    user: {
                        username: CurrentUser.username,
                        image: {png2: CurrentUser.image}
                    }
                }
                value.replies.push(replyObj);
                localStorage.setItem('comments', JSON.stringify(comments));
            }
        })
    }
    

    const handleSetState = (e)=>{
        setComment(e.currentTarget.value);
    }
    const handleAddComment = (e)=>{
        e.preventDefault();
        document.querySelector(".commentInput").value = "";
        
        const CommentObj = {
            content: comment,
            createdAt: "Now",
            id: uuidv4(),
            replies: [],
            score: 0,
            user: {
                username: CurrentUser.username,
                image: {png2: CurrentUser.image}
            }
        }

        if(actionName === "submitComment"){            
            setNewComment(CommentObj);
        }else{
            handleReply();
        }
        window.location.reload();
    }

    return (
        <form className="addBox" onSubmit={handleAddComment}>
            <img src={ProfileImage} alt="profile image" className="profileImage"/>
                    
            <textarea onChange={handleSetState} className="commentInput" placeholder="Add a comment..."></textarea>
                
            <button className={`btn  ${actionName==="submitComment"?"submitComment":"submitReply"}`}>

                {actionName === "submitComment" ? "ADD" : "REPLY"}
                
            </button>
        </form>

    )
}


AddComment.propTypes = {
    actionName: PropTypes.string,
    replyingTo: PropTypes.string
};