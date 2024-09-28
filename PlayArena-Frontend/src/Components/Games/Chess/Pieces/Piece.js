import React from 'react'
import { useAppContext } from '../../../../contexts/Context';
import arbiter from '../../arbiter/arbiter';

import { generateCandidates } from '../../../../reducer/actions/move';
import toast from 'react-hot-toast';
import { useSocketContext } from '../../../../contexts/SocketContext';
import { useCookies } from 'react-cookie';

const Piece = ({rank,file,piece}) => {
  const [cookies] = useCookies(['playerId'])

  const { appState, dispatch } = useAppContext();
  const {socketState,socketDispatch}=useSocketContext();
  const { turn, position :currentPosition,castleDirection } = appState
  const DragStart=(e)=>{
    e.dataTransfer.setData("text/plain",`${piece},${rank},${file}`)
    setTimeout(()=>{
       e.target.style.display = 'none'
    })
    

  let currentUserName='';
  if(socketState.users){  
     const currentUser = socketState.users.find(el => el.playerID === cookies.playerId);
     currentUserName = currentUser ? currentUser.userName : null  }
  
  if(socketState.socketConnection && socketState.turn!=currentUserName){
    toast.error('Your Opponent Turn not Yours.',{duration: 2000,})
    return;
  }

    if (turn === piece[0]){    
      let candidateMoves;
      candidateMoves=arbiter.getValidMoves({
        position : currentPosition[currentPosition.length - 1],
        piece,
        rank,
        file,
        previousPosition:currentPosition[currentPosition.length-2],
        castleDirection
      });
  
      dispatch(generateCandidates({candidateMoves}))
    }
    else{
      toast.error('Your Opponent Turn not Yours.',{duration: 2000,})
    }
  }

  const DragEnd=(e)=>{
   
    setTimeout(()=>{
      if(socketState.socketConnection && socketState.turn!==socketState.currentUserName){
        e.target.style.display = 'block';
        return;
      }
      if(piece[0]==turn)  toast.error('Not a Valid Move',{duration: 2000,})
       e.target.style.display = 'block'
    })
  }
  return (
    <div
     className={`piece ${piece} p-${rank}${file}`}
    draggable={true}
    onDragStart={DragStart}
    onClick={()=>{

      toast.error('Please Drag Elements to start the game ',{duration: 2000,})
      // toast.error("Please drag the element to start the game")
    }}
    onDragEnd={DragEnd}
     >
    </div>
  )
}

export default Piece
