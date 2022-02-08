import { useState } from 'react';
import SendMessageForm from '../components/SendMessageForm';
import { OptionButton } from '../components/styledComponents';
import { useStore } from '../contextAPI/context';
import Comment from './../components/comment';
import Modal from './../components/modal';
import './main.css';
import { AnimatePresence } from 'framer-motion';

function Main(props) {
  const { comments, 
    currentUser: { username }, 
    removeCommentLike, 
    likeComment, 
    replyComment, 
    deleteComment,
    editComment,
  } = useStore();
  localStorage.setItem('comments', JSON.stringify(comments));
  const [ replyCommentData, setReplyCommentData] = useState(null);
  let [commentIdUserWouldLikeToDelete, setCommentIdUserWouldLikeToDelete] = useState(null);
  function deleteCommentHandler(){
    deleteComment(commentIdUserWouldLikeToDelete);
    setCommentIdUserWouldLikeToDelete(null);
  }
  return (
      <main className='index'>
          <section className="index__comments">
            {
              comments.map((comment) => 
                <Comment 
                  key={comment.id} 
                  comment={comment} 
                  likeComment={likeComment}
                  replyComment={replyComment}
                  removeCommentLike={removeCommentLike}
                  setReplyCommentData={setReplyCommentData}
                  username={username}
                  replyCommentData={replyCommentData}
                  deleteComment={deleteComment}
                  editComment={editComment}
                  setCommentIdUserWouldLikeToDelete={setCommentIdUserWouldLikeToDelete}
                />
              )
            }
          </section>
          <SendMessageForm 
            replyCommentData={replyCommentData}
            setReplyCommentData={setReplyCommentData}
          />
          <AnimatePresence>
            {commentIdUserWouldLikeToDelete &&
              <Modal>
                <h5 className='modal__title'>Delete comment</h5>
                <p className='modal__description'>
                  Are you sure you want to delete this comment? This will remove the comment
                  and can't be undone.
                </p>
                <section className="modal__buttons">
                  <OptionButton 
                    onClick={() => setCommentIdUserWouldLikeToDelete(null)}
                  >
                    NO, CANCEL
                  </OptionButton>
                  <OptionButton 
                    danger
                    onClick={deleteCommentHandler}
                  >
                    YES, DELETE
                  </OptionButton>
                </section>
              </Modal>
            }
          </AnimatePresence>
      </main>
  );
}

export default Main;