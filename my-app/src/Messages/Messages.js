import React, { useEffect, useReducer, useState, createContext, useContext, useRef} from 'react';
import './Messages.css';
import { db } from "../firebase.js";
import { doc, setDoc, onSnapshot, getDoc, serverTimestamp, updateDoc, Timestamp, arrayUnion } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import Attach from '../Photos/Clip.png';
import {v4 as uuid} from 'uuid';

const ChatContext = createContext();

const Messages = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const uid = location.state.uid;

    const handleHomeClick = () => {
        navigate("/Homepage", { state: { uid: uid } });
    };

    return (
        <ChatContextProvider>
            <div className="messages">
                <div className="container">
                    <Sidebar onHomeClick={handleHomeClick} />
                    <Chat />
                </div>
            </div>
        </ChatContextProvider>
    );
};

const Chat = () => {
    const { data } = useContext(ChatContext);

    return (
        <div className="chat">
            <div className="chatInfo">
                <span>{data.user?.displayName || 'Select a Chat'}</span>
            </div>
            <DMs />
            <Input />
        </div>
    );
};

const Sidebar = ({ onHomeClick }) => {
    return (
        <div className="sidebar">
            <Navbar onHomeClick={onHomeClick} />
            <ChatList />
        </div>
    );
};

const Navbar = ({ onHomeClick }) => {
    return (
        <div className="navbar">
            <span className="navbar-text">Messages</span>
            <div className="user">
                <span></span>
                <button onClick={onHomeClick}>🏠</button>
            </div>
        </div>
    );
};

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const { dispatch } = useContext(ChatContext);
    const location = useLocation();
    const uid = location.state.uid;

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, 'userChats', uid), (doc) => {
                if (doc.exists()) {
                    setChats(doc.data());
                }
            });
            return () => unsub();
        };

        uid && getChats();
    }, [uid]);

    const handleDMSelect = (u) => {
        dispatch({ type: 'CHANGE_USER', payload: u });
    };

    return (
        <div className="chat-list">
            {Object.entries(chats)
                ?.sort((a, b) => b[1].date - a[1].date)
                .map((chat) => (
                    <div className="userChat" key={chat[0]} onClick={() => handleDMSelect(chat[1].userInfo)}>
                        <img src={chat[1].userInfo.photoURL} alt="profile" />
                        <div className="userChatInfo">
                            <span>{chat[1].userInfo.displayName}</span>
                            <p>{chat[1].lastMessage?.text || "No messages yet..."}</p>
                        </div>
                    </div>
                ))}
        </div>
    );
};

const DMs = () => {
    const [messages, setMessages] = useState([]);
    const {data} = useContext(ChatContext);

    useEffect(()=>{
        const unSub = onSnapshot(doc(db,"chats", data.chatId), (doc)=>{
            doc.exists() && setMessages(doc.data().messages);
        })
        return () => unSub()
    }, [data.chatId]);

    return (
        <div className="DMs">
            {messages?.map((m)=>(
                <Message message = {m} key = {m.id} />
            ))}
        </div>
    );
};

const Message = ({message}) => {
    const {data} = useContext(ChatContext);
    const [senderPhotoURL, setSenderPhotoURL] = useState("");
    console.log(message);
    const location = useLocation();
    const ref = useRef()

    useEffect(() => {
        const fetchUserPhoto = async (userId, setPhotoURL) => {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                setPhotoURL(userDoc.data().photoURL);
            }
        };
        
        fetchUserPhoto(location.state.uid, setSenderPhotoURL);
        ref.current?.scrollIntoView({behavior: "smooth" });
    }, [message]);

    const timestamp = new Date(message.date.seconds*1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    return (
        <div className={`message ${message.senderId === location.state.uid && "owner"}`}>
            <div className="messageInfo">
                <img src={message.senderId === location.state.uid ? senderPhotoURL : data.user.photoURL} alt="" />
                <span>{timestamp}</span>
            </div>
            <div className="messageContent">
                <p>{message.text}</p>
            </div>
        </div>
    );
};

const Input = () => {
    const [text, setText] = useState("");
    const location = useLocation();
    const { data } = useContext(ChatContext);

    const handleSend = async () => {
        try {
            const chatDocRef = doc(db, "chats", data.chatId);
            const chatDocSnap = await getDoc(chatDocRef);

            if (!chatDocSnap.exists()) {
                // If the chat doesn't exist, create it
                await setDoc(chatDocRef, {
                    messages: []
                });
            }

            // Add message to the chat
            await updateDoc(chatDocRef, {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: location.state.uid,
                    date: Timestamp.now(),
                }),
            });

            // Update the user's chat summary
            await updateDoc(doc(db, "userChats", location.state.uid), {
                [data.chatId + ".lastMessage"]: {
                    text,
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });

            await updateDoc(doc(db, "userChats", data.user.uid), {
                [data.chatId + ".lastMessage"]: {
                    text,
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });

            // Clear input after sending
            setText("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="input">
            <input 
                type="text" 
                placeholder="Type something..." 
                value={text}
                onChange={e => setText(e.target.value)}
            />
            <div className="send">
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

const ChatContextProvider = ({ children }) => {
    const location = useLocation();
    const uid = location.state.uid;

    const INITIAL_STATE = {
        chatId: "null",
        user: {},
    };

    const chatReducer = (state, action) => {
        switch (action.type) {
            case 'CHANGE_USER':
                return {
                    ...state,
                    user: action.payload,
                    chatId:
                        uid > action.payload.uid
                            ? uid + action.payload.uid
                            : action.payload.uid + uid,
                };

            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};

export default Messages;