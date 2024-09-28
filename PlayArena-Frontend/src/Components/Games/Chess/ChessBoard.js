import React, { useEffect } from 'react'
import socketIO, { Socket } from 'socket.io-client';
import { useState } from 'react';
import Pieces from './Pieces/Pieces'
import { numberToCharacters,takeBack } from '../../../helpers'
import { useAppContext } from '../../../contexts/Context'
import PopUpWrapper from '../../PopUpWrapper';
import PopUp from './PopUp/PopUp';
import MovesList from './MovesList'
import { useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import CircularLoading from '../../../helpers/Components/CircularLoading';
import { useSocketContext } from '../../../contexts/SocketContext';
import toast from 'react-hot-toast';
import { useCookies } from 'react-cookie';

const Ranks = ({ranks}) => 
  <div className="ranks">
      {ranks.map(rank => <span className='rank' key={rank}>{rank}</span>)}
  </div>

const Files = ({files}) => 
  <div className="files">
      {files.map(file => <span className='file' key={file}>{numberToCharacters(file)}</span>)}
  </div>
const ChessBoard = () => {
  const {socketState,socketDispatch}=useSocketContext();
  const [cookies, setCookie] = useCookies(['playerId'])
  const [nameError,setNameError]=useState(false);
  const [loading, setLoading] = useState(false);
    // const [initialAppState, setInitialAppState] = useState(JSON.parse(JSON.stringify(socketState)));
  const [name,setName]=useState('');
  let [searchParams, setSearchParams] = useSearchParams(window.navigator.search );
  const ranks=Array(8).fill().map((el,index)=>8-index);
  const [showPopUp, setshowPopUp] = useState(false);
  const files=Array(8).fill().map((el,index)=>index);
  const { appState,dispatch } = useAppContext();
  const roomId=searchParams.get('roomId');



  function listenToErrors(socketConnection){
    socketConnection.on('error',(message)=>{
      toast.error(message);
      // setSearchParams('');
    });
  }

  function listenToUserMoves(socketConnection){
    socketConnection.on('updateMoves',(data)=>{
      socketDispatch({type: 'updateGame', payload:{...data }});
      dispatch({type:'SET_DATA',payload:{...data.gamesData}});
    })

  }



  const JoinRoom=()=>{

    if(!name){
      setNameError(true);
      return;
    }
    let socketConnection=socketIO.connect('http://localhost:4000');


    socketConnection.on('playerID', (playerId) => {
      setCookie('playerId', playerId)
    });

    listenToUserMoves(socketConnection);

    socketConnection.on('startGame', (data) => {
      socketDispatch({ type: 'sendData', payload: {users:data.users,turn:data.turn,currentUserName:data.currentUserName} });
        dispatch({type:'SET_DATA',payload:data.gamesData});
      setshowPopUp(false);
    });


    socketDispatch({type:'connection',payload:socketConnection})
    listenToErrors(socketConnection);

    socketConnection.emit('join',{roomId,userName:name,gamesData:appState});
  }


  function joinWithCookie(playerID){
    let socketConnection=socketIO.connect('http://localhost:4000');
    socketConnection.on('gamesData',(data)=>{
      console.log('data inside gamesData of socketConnection is -----> ',data);
      // socketDispatch({type:'changeTurn'})
      socketDispatch({ type: 'sendData', payload:{socketConnection  , users: data.users,turn:data.turn,currentUserName:data.currentUserName} });
      // dispatch({type:'SET_DATA',payload:data.gamesData});
    })


    listenToUserMoves(socketConnection);

    socketDispatch({type:'connection',payload:socketConnection})
    socketConnection.emit('joinWithCookie',{playerID,roomId})
  }



  useEffect(()=>{
    if(!socketState.socketConnection && !cookies.playerId && roomId){
      setshowPopUp(true);
    }

    else if(cookies.playerId){
      joinWithCookie(cookies.playerId);
    }
 

  },[]);



console.log('appstate is ----> ',appState);

  const position = appState.position[appState.position.length - 1]
  const getClassName = (i,j) => {
    let c = 'tile'
    c+= (i+j)%2 === 0 ? ' tile--dark ' : ' tile--light '
    if (appState.candidateMoves?.find(m => m[0] === i && m[1] === j)){
      if (position[i][j])
          c+= ' attacking'
      else 
          c+= ' highlight'
  }

    return c
}
  return (

    <>
  <div className="flex gap-5 items-center flex-col">
    <div className="flex gap-8">
      <div className="board">
        <Ranks ranks={ranks}></Ranks>
        <div className="tiles">
          {ranks.map((rank, i) =>
            files.map((file, j) => (
              <div
                key={file + "" + rank}
                className={`${getClassName(i, j)}`}
              ></div>
            ))
          )}
        </div>

        {/* pieces ka array isliye alag bnaaya kyunki agar tiles upar hi background image lga dete toh jab drag krte toh background bhi drag hote huye nazar aata */}
        <Pieces />

        <Files files={files}></Files>

        <PopUp></PopUp>
      </div>
      {/* <MovesList /> */}
    </div>
  </div>



      <PopUpWrapper
      props={{
          show: showPopUp,
          setShow: setshowPopUp,
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
                  <button  disabled={loading} className={`p-2   ${loading ?  'disabled_btn':''}  w-full h-fit`} onClick={()=>{
                      JoinRoom();
                  }}>
                    <span className={`loading ${loading?'active':''}`} ></span>
                    Join
                  </button>                 
              </div>
          )
      }
      }
      ></PopUpWrapper>
    
    
    
    </>
  
  );
}

export default ChessBoard
