import data from './../assets/data.json';

import { ADD_COMMENT, DELETE_COMMENT, EDIT_COMMENT, LIKE_COMMENT, REMOVE_COMMENT_LIKE, REPLY__COMMENT } from "../constants";

export default function commentsReducer(store, action){
    switch(action.type){
        case ADD_COMMENT:
            action.payload.score = 0;
            action.payload.replies = [];
            return { 
                currentUser: store.currentUser, 
                comments: [...store.comments, action.payload],
                myLikedComments: store.myLikedComments
            };
        case REPLY__COMMENT:
            let repliedCommentPos = null;
            if(action.payload.parentId){
                repliedCommentPos = store.comments.findIndex(comment => comment.id === action.payload.parentId);
            }else{
                repliedCommentPos = store.comments.findIndex(comment => {return comment.id === action.payload.replyId});
            }
            store.comments[repliedCommentPos].replies.push(action.payload);
            store.comments[repliedCommentPos].replies[store.comments[repliedCommentPos].replies.length - 1].score = 0;
            return {
                currentUser: store.currentUser, 
                comments: store.comments,
                myLikedComments: store.myLikedComments
            }
        case LIKE_COMMENT:
            if(store.myLikedComments.length > 0 && store.myLikedComments.includes(action.payload.id)) return store;
            let { comments, currentUser, myLikedComments } = store;
            if(action.payload.parentId){
                const parentComment = comments.find(comment => comment.id === action.payload.parentId);
                const parentCommentIndex = comments.indexOf(parentComment);
                parentComment.replies = parentComment.replies.map(reply => {
                    if(reply.id === action.payload.id)
                        reply.score++;
                    return reply;
                });
                comments[parentCommentIndex] = parentComment;
            }else{
                comments = comments.map(comment => {
                    comment.score = comment.id === action.payload.id ? comment.score + 1 : comment.score;
                    return comment;
                });
            };
            return { 
                currentUser, 
                comments,
                myLikedComments: [...myLikedComments, action.payload.id],
            };
        case REMOVE_COMMENT_LIKE:
            if(store.myLikedComments.length === 0 && !store.myLikedComments.includes(action.payload.id)) return store;
            let commentsList = store.comments;
            if(action.payload.parentId){
                const parentComment = store.comments.find(comment => comment.id === action.payload.parentId);
                const parentCommentIndex = store.comments.indexOf(parentComment);
                parentComment.replies = parentComment.replies.map(reply => {
                    if(reply.score > 0 && reply.id === action.payload.id)
                        reply.score--;
                    return reply;
                });
                commentsList[parentCommentIndex] = parentComment;
            }else{
                commentsList = store.comments.map(comment => {
                    comment.score > 0 && comment.id === action.payload.id && comment.score--;
                    return comment;
                });

            };
            return { 
                currentUser: store.currentUser, 
                comments: commentsList,
                myLikedComments: store.myLikedComments.filter(liked => liked !== action.payload.id),
        };
        case EDIT_COMMENT:
            if(!action.payload.content) return store;
            let storedComments = store.comments;
            if(action.payload.parentId){
                let parentCommentIndex = storedComments.findIndex(comment => comment.id === action.payload.parentId);
                let replyIndex = storedComments[parentCommentIndex].replies.findIndex(reply => reply.id === action.payload.id);
                storedComments[parentCommentIndex].replies[replyIndex].content = action.payload.content;
            }else if(action.payload.replyId){
                let commentParentindex = storedComments.findIndex(comment => 
                    comment.id === action.payload.replyId
                );
                let replyIndex = storedComments[commentParentindex].replies.findIndex(reply => reply.id === action.payload.id);
                storedComments[commentParentindex].replies[replyIndex].content = action.payload.content;
            }else{
                storedComments = storedComments.map(comment => {
                    comment.id === action.payload.id && (comment.content = action.payload.content);
                    return comment;
                });
            };
            return { 
                currentUser: store.currentUser, 
                comments: storedComments,
                myLikedComments: store.myLikedComments,
        };
        case DELETE_COMMENT:
            const { payload: { id, parentId } } = action;
            if(parentId){
                const parentCommentIndex = store.comments.findIndex(comment => comment.id === parentId);
                store.comments[parentCommentIndex].replies = store.comments[parentCommentIndex].replies
                .filter(reply => reply.id !== id && reply.replyId !== id);
            }else{
                store.comments = store.comments.filter(comment => {
                    return comment.id !== id && comment.replyId !== id;
                });
            }
            return { 
                currentUser: store.currentUser, 
                comments: store.comments,
                myLikedComments: store.myLikedComments,
        };
        default: 
        return store;
    }
}

data.myLikedComments = []
export const initialState = data;