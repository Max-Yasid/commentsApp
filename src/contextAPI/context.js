import { createContext, useReducer, useContext } from 'react';
import Reducer, { initialState } from './reducer';
import { ADD_COMMENT, DELETE_COMMENT, EDIT_COMMENT, LIKE_COMMENT, REMOVE_COMMENT_LIKE, REPLY__COMMENT } from "../constants";

const localStoredComments = JSON.parse(localStorage.getItem('comments'));
export const context = createContext(localStoredComments || initialState);

function ContextProvider({ children }){
    
    const [store, dispatch] = useReducer(Reducer, localStoredComments || initialState);

    const storeActions = {
        addComment: (comment) => (dispatch({ type: ADD_COMMENT, payload: comment })),
        deleteComment: (commentId) => (dispatch({ type: DELETE_COMMENT, payload: commentId })),
        editComment: (commentId) => (dispatch({ type: EDIT_COMMENT, payload: commentId })),
        likeComment: (commentId) => (dispatch({ type: LIKE_COMMENT, payload: commentId })),
        removeCommentLike: (commentId) => (dispatch({ type: REMOVE_COMMENT_LIKE, payload: commentId })),
        replyComment: (reply) => dispatch({type: REPLY__COMMENT, payload: reply }),
    }

    return <context.Provider value={{ ...store, ...storeActions }}>
        {children}
    </context.Provider>
}

export const useStore = () => useContext(context);

export default ContextProvider;