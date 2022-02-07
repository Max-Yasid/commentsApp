import { useEffect, useRef } from 'react';
import './sendMessageForm.css';
import * as uuid from 'uuid';
import { useStore } from './../contextAPI/context';
import { extractFileNameFromPath } from '../utils/functions';

function SendMessageForm({ replyCommentData, setReplyCommentData }) {
    const { currentUser , addComment, replyComment } = useStore();
    let textareaRef = useRef(null);
    let containerAllRef = useRef(null);
    useEffect(() => {
        let textareaElem = textareaRef.current;
        if(textareaElem){
            let usernameSpan = null;
            let checkIfUserRemovedReplierNameFromComment = ({ target: { innerHTML } }) => {
                    console.log(innerHTML)
                    let spanElementWithUsernameInside = `<span class="messageForm__replyContentUsername" contenteditable="false">${usernameSpan.innerHTML}</span>`;
                    !innerHTML.includes(spanElementWithUsernameInside) && setReplyCommentData(null);
            }
            if(replyCommentData){
                usernameSpan = document.createElement('span');
                usernameSpan.className = "messageForm__replyContentUsername";
                usernameSpan.innerText = ` @${replyCommentData.toReplyUsername}`
                usernameSpan.contentEditable = false;
                textareaElem.appendChild(usernameSpan);
                textareaElem.addEventListener('input',checkIfUserRemovedReplierNameFromComment);
                textareaElem.dispatchEvent(new Event('input', {bubbles:true}));
            }
            return () => textareaElem.removeEventListener('input',checkIfUserRemovedReplierNameFromComment);
        }
    }, [replyCommentData, setReplyCommentData]);
    useEffect(() => {
        let textareaElem = textareaRef.current, containerAllElem = containerAllRef.current;
        if(textareaElem && containerAllElem){
            containerAllElem.style.height = (textareaElem.clientHeight + 120) + "px";
            function setHeightToContainerWhenTextareaChangeSize(){
                window.scrollTo(0, document.documentElement.scrollTop + (textareaElem.clientHeight - containerAllElem.clientHeight + 120));
                containerAllElem.style.height = (textareaElem.clientHeight + 120) + "px";
            }

            textareaElem.addEventListener('input', setHeightToContainerWhenTextareaChangeSize);
            return () => textareaElem.removeEventListener('input',setHeightToContainerWhenTextareaChangeSize);
        };
    });

    
    async function getAnswerFromBot(message){
        return await fetch(`https://paphus-botlibre.p.rapidapi.com/form-chat?instance=41705054&application=6053253515890681897&user=bromot&password=RopaDotaProgramacion123%24&conversation=1234&message=${message}%20%20Bot`, {
          "method": "GET",
          "headers": {
            "x-rapidapi-host": "paphus-botlibre.p.rapidapi.com",
            "x-rapidapi-key": "f3357837d2msha87c0ca429af181p18635cjsn1e157bb79c75"
            }
          })
          .then(res => res.text())
          .then(res => { 
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(res,"text/xml");
            return xmlDoc;
          })
          .catch(err => {
            console.error(err);
          }
        );
    }
    function parseXMLToJSON(XML){
        return {
            avatar: XML.getElementsByTagName("response")[0].getAttribute('avatarBackground'),
            content: XML.getElementsByTagName("message")[0].childNodes[0].nodeValue,
        }
    }
    async function submitComment(e){
        e.preventDefault();
        let content = removeUsernameFromTextAreaComment(textareaRef.current);
        if(!content) return;
        const commentData = createCommentData(content);
        replyCommentData ? replyComment(commentData) : addComment(commentData);
        cleanForm();
        textareaRef.current.dispatchEvent(new Event('input', {bubbles:true}));
        const botResponse = parseXMLToJSON(await getAnswerFromBot(commentData.comment));
        const botData = { 
            username: replyCommentData?.toReplyUsername || 'Max', 
            image: { png: replyCommentData?.toReplyAvatar || 'bot-avatar.png' }
        };
        const botReplyData =  
            { id: commentData.id, parentId: replyCommentData && commentData.replyId };
        const botAnswerData = createCommentData(botResponse.content, botData, botReplyData);
        replyComment(botAnswerData);
        setReplyCommentData(null);
    }
    function cleanForm(){
        textareaRef.current.innerHTML = '';
    }

    function removeUsernameFromTextAreaComment(comment){
        let { innerText } = comment;
        if(replyCommentData){
            return  innerText.replaceAll(`@${replyCommentData.toReplyUsername}`, '');
        }
        return innerText;
    }

    function createCommentData(content, user = currentUser, replyData = null){
        return {
            replyId: replyData?.id || replyCommentData?.id,
            parentId: replyCommentData?.parentId || replyData?.parentId,
            id: uuid.v4(),
            content,
            createdAt: new Date().getTime(),
            user,
        };
    }

    const avatarPath = currentUser.image.png;
    return (
        <div className="containerAll" ref={containerAllRef}>
        <section className="messageFormContainer">
            <form onSubmit={(e) => submitComment(e)} className='messageForm'>
                <div
                    className="messageForm__input"
                    placeholder='Add a comment...'
                    ref={textareaRef}
                    contentEditable={true}
                ></div>
                <img 
                    className="messageForm__photo" 
                    src={require(`../assets/images/avatars/${extractFileNameFromPath(avatarPath)}`)} 
                    alt="user avatar"
                    width={40}
                    height={40} 
                />
                <div className="messageForm__submit">
                    <button type='submit' className="messageForm__btnSubmit">
                        SEND
                    </button>
                </div>
            </form>
        </section>
        </div>
    );
}

export default SendMessageForm;