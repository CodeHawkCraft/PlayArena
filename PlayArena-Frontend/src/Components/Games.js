import React from 'react'
import { useNavigate } from "react-router-dom";
import PopUpWrapper from './PopUpWrapper';
import { useState } from 'react';
import socketIO from 'socket.io-client';
import { useSocketContext } from '../contexts/SocketContext';
import { useAppContext } from '../contexts/Context';
import { useRef } from 'react';
import { useCookies } from 'react-cookie';
const Games = () => {
  const backendApi = process.env.BACKEND_DEV || 'https://playarena-backend.onrender.com';
  console.log("Backend Api is ------> ",backendApi)
  const frontendURl=process.env.REACT_APP_FRONTEND_DEV || 'https://playarena-murex.vercel.app/';
  const [cookies, setCookie] = useCookies(['playerId'])
    const [name,setName]=useState('');
    const inputElement = useRef();
    const [sharableLink, setsharableLink] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { appState } = useAppContext();
    const {socketDispatch}=useSocketContext();


    const [nameError,setNameError]=useState(false);
    const createRoom = async() => {
      
      if (!name) {
        setNameError(true);
        return;
      }
      if(nameError) setNameError(false);


      
      const socketConnection = socketIO.connect(backendApi);

      socketDispatch({ type: 'connection', payload: socketConnection });
      
      socketConnection.on('roomId', (roomId) => {
        let link=`${frontendURl}game/chess?roomId=${roomId}`;
        setsharableLink(link);
      });


      socketConnection.on('playerID', (playerId) => {
        setCookie('playerId', playerId)
      });




      socketConnection.on('startGame', (data) => {
        navigate(`/game/chess?roomId=${data.roomId}`);
      });

      


    
      socketConnection.emit('create', { userName: name, payload: appState,turn:name });
      setLoading(true);
    };
   
    const [showPopUp, setShowPopUp] = useState(false);
    const gamesArray = [
        {
            title: 'Tic Tac Toe',
            image: 'https://images.unsplash.com/photo-1668901382969-8c73e450a1f5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRpYyUyMHRhYyUyMHRvZXxlbnwwfHwwfHx8MA%3D%3D',
        },
       
       
    ]
  
    return (



        <>

   

<div className='flex h-screen w-full  flex-col gap-5  p-5'>
            <div className='flex py-8 gap-4 items-center  sm:flex-row flex-col-reverse px-5 justify-between'>
        <h1 className='text-5xl text-center'>Games Availabale </h1>
        <button onClick={()=>{
        navigate('/')
      }} className="">
        Home
      </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6   w-full h-full'>
           
            {gamesArray.map((el, index) => {
                return (
                  <div
                    key={index}
                    className="h-fit w-full border bg-black border-white"
                  >
                    <img
                      src={el.image}
                      className="w-full h-[250px] object-cover"
                      alt={el.title}
                    />
                    <div className="flex flex-col items-center gap-8 py-10">
                      <button
                        className="p-2 w-fit h-fit"
                        onClick={() => {
                          localStorage.removeItem('gamesData');
                          navigate("/game/chess");
                        }}
                      >
                        Start Playing 
                      </button>

                      <button
                        className="p-2 w-fit  h-fit"
                        onClick={() => {
                            setShowPopUp(true) 
                        }}
                      >
                        Play Online
                      </button>
                    </div>
                  </div>
                );
            })}
        </div>
        </div>
        <PopUpWrapper
        props={{
            show: showPopUp,
            setShow: setShowPopUp,
            title: <h1 className=" text-3xl">Ask friend to join this link</h1>,
            component:(
                <div className='p-2 w-full flex flex-col gap-5'>
                    <input
                    
                    placeholder='Enter Your Name' value={name} onChange={(e)=>{setName(e.target.value);}} className=
                    {`p-4 border w-full  outline-none
                      ${nameError?'border border-red-500':'border-gray-600'}
                    
                    `}></input>
                    {nameError? 
                    <span className='text-red-500'>*Please enter your name</span>
                    :null}
                    
                    <input
                    ref={inputElement}
                    value={sharableLink} disabled={true}
                     className={`p-4 border w-full  border-gray-600`}
                     ></input>
                    <button   className="p-2 w-full h-fit bg-gray-900 text-white" onClick={()=>{
                      const inputValue=inputElement.current.value;
                      if(!inputValue) return;
                      navigator.clipboard.writeText(inputValue)
                    }}>Copy Link</button>
                    <button  disabled={loading} className={`p-2   ${loading ?  'disabled_btn':''}  w-full h-fit`} onClick={()=>{
                        createRoom();
                    }}>
                      <span className={`loading ${loading?'active':''}`} ></span>
                      Join Link
                    </button>
                    {loading? 
                    
                    <span>
                    Copy the above link and send it with your to start the game. Once your friend will open this link you will be redirected to game.
                  </span>
                    :null}
                   
                </div>
            )
        }
        }
        ></PopUpWrapper>

      
        </>
    )
}

export default Games
