import React, { memo, useEffect, useRef, useState } from 'react';
import './comment.css';
import { CommentOption } from './styledComponents';
import replyIcon from './../assets/images/icon-reply.svg';
import deleteIcon from './../assets/images/icon-delete.svg';
import editIcon from './../assets/images/icon-edit.svg';
import { extractFileNameFromPath, formatDateToTimeAgoText } from '../utils/functions';

function CommentWithRepliesIfExists({ 
    replyCommentData, 
    comment, 
    likeComment, 
    deleteComment, 
    removeCommentLike, 
    setReplyCommentData, 
    username, 
    editComment,
    setCommentIdUserWouldLikeToDelete,
}) {
    return (
        <section className="commentWithReplies">
            <CommentTemplate 
                comment={comment} 
                likeComment={likeComment} 
                removeCommentLike={removeCommentLike}
                setReplyCommentData={setReplyCommentData}
                username={username}
                replyCommentData={replyCommentData}
                deleteComment={deleteComment}
                editComment={editComment}
                setCommentIdUserWouldLikeToDelete={setCommentIdUserWouldLikeToDelete}
            />
            {comment.replies.length > 0 && 
                <section className="commentWithReplies__repliesContent">
                    <div className="commentWithReplies__verticalLine">

                    </div>
                    <div className="commentWithReplies__replies">
                        {
                            comment.replies.map(reply => 
                                <CommentTemplate 
                                    key={reply.id}
                                    comment={reply} 
                                    likeComment={likeComment}
                                    removeCommentLike={removeCommentLike}
                                    parentId={comment.id}
                                    parentCommentOwner={comment.user.username}
                                    setReplyCommentData={setReplyCommentData}
                                    username={username}
                                    replyCommentData={replyCommentData}
                                    parentComment={reply.replyId && comment}
                                    deleteComment={deleteComment}
                                    editComment={editComment}
                                    setCommentIdUserWouldLikeToDelete={setCommentIdUserWouldLikeToDelete}
                                />
                            )
                        }
                    </div>
                </section> 
            }
        </section>
    );
}

const CommentTemplate = memo(({ 
        username, 
        comment, 
        likeComment, 
        removeCommentLike, 
        replyCommentData, 
        setReplyCommentData, 
        editComment,
        setCommentIdUserWouldLikeToDelete,
        parentCommentOwner = null, 
        parentId = null, 
        parentComment = null 
    }) => {
    const imagePath = comment.user.image.png;
    const [doesUserWouldLikeToEdit, setdoesUserWouldLikeToEdit] = useState(false);
    let dateRef = useRef(null);
    let editCommentRef = useRef(null);
    useEffect(() => {
        let commentDateInterval = null;
        if(typeof comment.createdAt !== 'string'){
            commentDateInterval = setInterval(() => 
                dateRef.current.innerText = formatDateToTimeAgoText(comment.createdAt)
            , 1000);
        }
        return (() => clearInterval(commentDateInterval));
    }, [comment.createdAt]);

    const isTheReplyAReplyFromAnotherComment = comment.parentId;
    if(isTheReplyAReplyFromAnotherComment){
        parentCommentOwner = parentComment.replies.find(reply => reply.id === comment.replyId).user.username;
    }
    let commentData = { id: comment.id, toReplyUsername: comment.user.username, parentId, toReplyAvatar: comment.user.image.png };
    function updateComment(){
        const updatedComment = editCommentRef.current.innerText.replace(`@${parentCommentOwner}`, '').trim();
        if(!updatedComment) return;
        let updateCommentData = { ...comment, content: updatedComment, parentId: comment.parentId };
        editComment(updateCommentData)
        setdoesUserWouldLikeToEdit(false);
    }
    return (
        <div className='comment'>
            <section className="comment__header">
                <img 
                    src={require(`../assets/images/avatars/${extractFileNameFromPath(imagePath)}`)} 
                    alt="avatar" 
                    className="comment__thumbnail"
                    width={40}
                    height={40}
                />
                <div className='comment__username'>
                    {comment.user.username}
                </div>
                {username === comment.user.username && 
                    <div className="comment_youText">
                        YOU
                    </div>
                }
                <div className='comment__date' ref={dateRef}>
                    {typeof comment.createdAt === 'string' ? comment.createdAt : 'just now'}
                </div>
            </section>
            {!doesUserWouldLikeToEdit &&
                <section 
                    className={`comment__content ${doesUserWouldLikeToEdit && "comment__content--edit"}`}
                    contentEditable={doesUserWouldLikeToEdit}
                >
                    {parentCommentOwner && <span 
                        className='comment__replyContentUsername'
                    >   
                        @{parentCommentOwner + " "}
                    </span>} 
                    {comment.content}
                </section>
            }
            {doesUserWouldLikeToEdit &&
            <React.Fragment>
                <section 
                    className={`comment__content comment__content--edit`}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    ref={editCommentRef}
                >
                    {parentCommentOwner && <span 
                        className='comment__replyContentUsername'
                        contentEditable={false}
                    >   
                        @{parentCommentOwner + " "}
                    </span>} 
                    {comment.content}
                </section>
                <div className="comment__editButtonContainer">
                    <button 
                        className="comment__btnEdit" 
                        onClick={updateComment}
                    >
                        UPDATE
                    </button>
                </div>
            </React.Fragment>
            }
            <section className="comment__likesContainer">
                <div className="comment__likes">
                    <button 
                        className="comment__likeComment" 
                        onClick={() => likeComment({parentId, id: comment.id })}
                    >
                        +
                    </button>
                    <div 
                        className="comment__likeCounter" 
                    >
                        {comment.score}
                    </div>
                    <button 
                        className="comment__dislikeComment"
                        onClick={() => removeCommentLike({parentId, id: comment.id })}
                    >
                        -
                    </button>
                </div>
            </section>
            <section className="comment__options">
                {username === comment.user.username ?
                    <React.Fragment>
                    <CommentOption 
                        danger
                        onClick={() => setCommentIdUserWouldLikeToDelete({ id: comment.id, parentId })}
                    >
                        <img 
                            src={deleteIcon} 
                            alt="delete icon" 
                        /> Delete
                    </CommentOption>
                    <CommentOption 
                        onClick={() => setdoesUserWouldLikeToEdit(!doesUserWouldLikeToEdit)}
                    >
                        <img src={editIcon} alt="edit icon" /> Edit
                    </CommentOption>
                    </React.Fragment> : 
                    <CommentOption 
                        onClick={() => 
                            JSON.stringify(commentData) !== JSON.stringify(replyCommentData) && 
                                setReplyCommentData(commentData)}
                    >
                        <img src={replyIcon} alt="reply icon" /> Reply
                    </CommentOption>
                }
            </section>
        </div>
    );
});

export default React.memo(CommentWithRepliesIfExists);