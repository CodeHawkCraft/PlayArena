import React from 'react'
import MovesList from './MovesList'
import { useAppContext } from '../../../contexts/Context';
import { takeBack } from '../../../helpers';
import LostPlayers from './LostPlayers';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../../../contexts/SocketContext';
import { initGameState } from '../../../helpers';
import { useSearchParams } from "react-router-dom";
const LeaderBoard = () => {
    const { dispatch } = useAppContext();
    const {socketState}=useSocketContext();
    const navigate=useNavigate();
    let [searchParams,] = useSearchParams(window.navigator.search );
    const roomId=searchParams.get('roomId');
  return (
    <>
    <div className="flex  flex-col gap-5  w-full justify-center">
      {socketState?.users?.length === 2 ? (
        <div className='flex justify-center items-center gap-3'>
         <h2 className='text-center text-3xl'>Turn &rarr;</h2>
          <p className='text-2xl'>{socketState.turn}</p>
          </div>        
      ) : null}

      <MovesList />
      <LostPlayers></LostPlayers>
      <div className="flex flex-col w-full items-center justify-center gap-10">
        <div className='flex gap-10'>
        <button
          onClick={() => {
            dispatch(takeBack());
          }}
        >
          Take Back
        </button>
        <button
          onClick={() => {
            navigate("/games");
          }}
        >
          All Games 
        </button>

        </div>

        <div className='flex gap-5'>
        <button
          onClick={() => {
           localStorage.removeItem('gamesData');
           dispatch({type:'SET_DATA',payload:{...initGameState}});
          }}
        >
          Start New Game 
        </button>

{roomId &&  socketState.socketConnection ?
  <button
  onClick={() => {

    
    if(socketState.socketConnection && roomId){
      socketState.socketConnection.emit('leaveRoom',{roomId});
    }
  }}
>
  Leave Room
</button>
:null}
      


        </div>
      </div>
    </div>
    
    </>
  );
}

export default LeaderBoard
