import React from 'react'
import MovesList from './MovesList'
import { useAppContext } from '../../../contexts/Context';
import { takeBack } from '../../../helpers';
import LostPlayers from './LostPlayers';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../../../contexts/SocketContext';
const LeaderBoard = () => {
    const { appState,dispatch } = useAppContext();
    const {socketState,socketDispatch}=useSocketContext();
    const navigate=useNavigate();
  return (
    <div className="flex  flex-col gap-5  w-full justify-center">
      {socketState?.users?.length === 2 ? (
        <div className='flex justify-center items-center gap-3'>
         <h2 className='text-center text-3xl'>Turn &rarr;</h2>
          <p className='text-2xl'>{socketState.turn}</p>
          </div>        
      ) : null}

      <MovesList />
      <LostPlayers></LostPlayers>
      <div className="flex w-full items-center justify-center gap-10">
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
    </div>
  );
}

export default LeaderBoard
