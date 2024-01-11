import PropTypes from 'prop-types';
import replyIcon from '../assets/images/icon-reply.svg'
import plus from '../assets/images/icon-plus.svg'
import minus from '../assets/images/icon-minus.svg'
import deleteIcon from '../assets/images/icon-delete.svg'
import editIcon from '../assets/images/icon-edit.svg'
import AddComment from './AddComment';
import { useState } from 'react';





export default function Comment({score,avatartUrl,isOwner,commentedA,replyingTo,name,commentContent}){

    const [showReply,setShowReply] = useState(false);


    const saveVote = (score,e,element)=>{
        let username = e.currentTarget.parentElement.nextElementSibling.children[0].children[1].innerText;
        const existsComments = JSON.parse(localStorage.getItem("comments"));
        
        let isReply = e.currentTarget.parentElement.parentElement.parentElement.parentElement.classList.value
        if(isReply === "commentReply"){
            
            existsComments.map((comment)=>{
                comment.replies.map((commentReply)=>{
                    if(commentReply.user.username.trim() === username.trim()){
                        commentReply.score = parseInt(element.innerText);
                    }
                })
            })

        }else{
            existsComments.map((comment)=>{
                if(comment.user.username.trim() === username.trim()){
                    comment.score = parseInt(element.innerText);
                }
            })
        }
        
        
        
        localStorage.setItem("comments", JSON.stringify(existsComments));
        window.dispatchEvent(new Event('storage'));
    }

    const handleShowReply = ()=>{
        setShowReply((prev)=>!prev);
    }
    const handleUpVote = (e)=>{
        
        const element = e.currentTarget.nextElementSibling;
        element.innerText = parseInt(element.innerText) + 1;
        
        saveVote(element.innerText,e,element);
        
        
    }
    const handleDownVote = (e)=>{
        const element = e.currentTarget.previousElementSibling;
        if(parseInt(element.innerText) !== 0){
            element.innerText = parseInt(element.innerText) - 1;
            saveVote(element.innerText,e,element);
        }
    }


    const handleEdit = (e)=>{
        const currentCommentContent = e.currentTarget.parentElement.previousElementSibling.children[1].innerText;
        const editCommentInput = document.querySelector(".editCommentInput");
        const saveBtn = document.getElementById("saveEdit");
        editCommentInput.value = currentCommentContent;


        let isReply = e.currentTarget.parentElement.parentElement.parentElement.parentElement.classList.value



        function RunSaveEdit(){
            console.log('new content:',editCommentInput.value);
            const existsComments = JSON.parse(localStorage.getItem("comments"));
            
            
            if(isReply === "commentReply"){
                existsComments.map((comment)=>{
                    comment.replies.map((commentReply)=>{
                        const regex = /@\S+/;
                        const extractedText = currentCommentContent.replace(regex, '');
                        if(commentReply.content.trim() === extractedText.trim()){
                            const extractedText2 = editCommentInput.value.replace(regex, '');
                            commentReply.content = extractedText2;
                        }
                    })
                })
            }else{
                existsComments.map((comment)=>{
                    if(comment.content.trim() === currentCommentContent.trim()){
                        comment.content = editCommentInput.value;
                    }
                })    
            }
            
            localStorage.setItem("comments", JSON.stringify(existsComments));
            window.location.reload();
        }


        saveBtn.addEventListener('click',RunSaveEdit);
    }
    const handleDelete = (e)=>{
        const confirmBtn = document.getElementById("saveDelete");
        let commentContent = e.currentTarget.parentElement.previousElementSibling.children[1].innerText;
        console.log(commentContent);
        if (commentContent.includes("@")){
            const regex = /@\S+/;
            const extractedText = commentContent.replace(regex, '');
            commentContent = extractedText;
        }

        function RunDelete(){
            const existsComments = JSON.parse(localStorage.getItem("comments"));
            let newComments = [];

            existsComments.forEach((comment) => {
            const filteredReplies = comment.replies.filter(
                (reply) => reply.content.trim() !== commentContent.trim()
            );

            if (comment.content.trim() !== commentContent.trim() || filteredReplies.length > 0) {
                newComments.push({
                ...comment,
                replies: filteredReplies,
                });
            }
            });

            localStorage.setItem("comments", JSON.stringify(newComments));
            window.location.reload();
        }

        confirmBtn.addEventListener('click',RunDelete);
    }

    return (
        <div className="CommentBox">
            <div className="container comment">

                <div className="vote">
                    <img src={plus} alt="plus" className="upVote" onClick={handleUpVote}/>
                    
                    <p className='votedN'>{score}</p>

                    <img src={minus} className="downVote" onClick={handleDownVote}/>
                </div>

                <div className="commentDetails">
                    
                    <div className="commentInfo">
                        <img src={avatartUrl} alt="avatar image" className="profileImage"/>
                        <p className="profileName">{name}</p>
                        {isOwner && <p className="ownerComment">you</p>}
                        
                        <p className="commentedA">{commentedA}</p>
                    </div>  

                    <p className="commentText">
                        {replyingTo && <span className="replyingTo">@{replyingTo} </span>}{commentContent}
                    </p>

                </div>

                {
                    isOwner ? 
                    <div className="commentManage">
                        <button onClick={handleDelete} className="commentDelete" data-bs-toggle="modal" data-bs-target="#deleteModal">
                            <img src={deleteIcon} alt="icon"/>
                            Delete
                        </button>
                        <button onClick={handleEdit} className="commentEdit" data-bs-toggle="modal" data-bs-target="#editModal">
                            <img src={editIcon} alt="icon"/>
                            Edit
                        </button>   
                    </div>
                    :
                    <button className="commentReply" onClick={handleShowReply}>
                        <img src={replyIcon} alt="icon"/>
                        Reply
                    </button>
                }



                {/* Edit Modal */}
                <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">Edit comment</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <textarea className="editCommentInput" placeholder="Add a comment..."></textarea>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" id='saveEdit' data-bs-dismiss="modal">Save changes</button>
                        </div>
                        </div>
                    </div>
                </div>
                {/* Delete Modal */}
                <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Delete comment</h5>
                        </div>
                        <div className="modal-body">
                            <p>
                            Are you sure you want to delete this comment?
                            This will remove the comment and can’t be undone.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">NO, CANCEL</button>
                            <button type="button" className="btn btn-primary" id='saveDelete' data-bs-dismiss="modal">YES, DELETE</button>
                        </div>
                        </div>
                    </div>
                </div>


                
                
            </div>

            <div className="replyInput">
                {!isOwner && showReply && <AddComment replyingTo={name}/>}
            </div>


            <div className="replies">
                
            </div>
        
        


        </div>
    )
}




Comment.propTypes = {
    score: PropTypes.number.isRequired,
    isOwner: PropTypes.bool.isRequired,
    avatartUrl: PropTypes.string.isRequired,
    commentedA: PropTypes.string.isRequired,
    replyingTo: PropTypes.string,
    commentContent: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};