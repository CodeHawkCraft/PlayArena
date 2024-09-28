import React, { useRef } from 'react'
import Piece from './Piece';
import { makeNewMove,clearCandidates } from '../../../../reducer/actions/move';
import { useAppContext } from '../../../../contexts/Context';
import { numberToCharacters, openPromotion } from '../../../../helpers';
import {updateCastling} from '../../../../helpers/index'
import { useSocketContext } from '../../../../contexts/SocketContext';
import { useSearchParams } from "react-router-dom";
const Pieces = () => {
  const ref = useRef()
  const {socketState,socketDispatch}=useSocketContext();
  let [searchParams, setSearchParams] = useSearchParams(window.navigator.search );
  const roomId=searchParams.get('roomId');
  const { appState , dispatch } = useAppContext();

  
  const currentPosition = appState.position[appState.position.length-1]
  const calculatedDroppedPoints=(e)=>{
    const getPiecesDiv = ref.current.getBoundingClientRect(); 
    const squareSize = getPiecesDiv.width / 8;  // Each square size
    const colDropped = Math.floor((e.clientX - getPiecesDiv.left) / squareSize);  // Column (0 to 7)
    const rowDropped = Math.floor((e.clientY - getPiecesDiv.top) / squareSize);  // Column (0 to 7)
    return { rowDropped, colDropped};
  }

    const openPromotionBox = ({rank,file,rowDropped,colDropped}) => {

        dispatch(openPromotion({
            rank:Number(rank),
            file:Number(file),
            rowDropped,
            colDropped
        }))
    }

    const getCastlingDirections = ({castleDirection,piece,file,rank}) => {
      file = Number(file)
      rank = Number(rank)
      const direction = castleDirection[piece[0]]
      if (piece.endsWith('k'))
          return 'none'
  
      if (file === 0 && rank === 0 ){ 
        if (direction === 'both')
              return 'right'
          if (direction === 'left')
              return 'none'
      } 
      if (file === 7 && rank === 0 ){ 
          if (direction === 'both')
              return 'left'
          if (direction === 'right')
              return 'none'
      } 
      if (file === 0 && rank === 7 ){ 
          if (direction === 'both')
              return 'right'
          if (direction === 'left')
              return 'none'
      } 
      if (file === 7 && rank === 7 ){ 
          if (direction === 'both')
              return 'left'
          if (direction === 'right')
              return 'none'
      } 
  }

    const updateCastlingState = ({ piece, file, rank }) => {
      const direction = getCastlingDirections({
        castleDirection: appState.castleDirection,
        piece,
        file,
        rank,
      });
      if (direction) {
        dispatch(updateCastling(direction));
      }
    };

  const onDrop = e => {
    console.log('onDrop running bro----->');
    
   const {rowDropped,colDropped}=calculatedDroppedPoints(e);
    const [piece,rank,file] = e.dataTransfer.getData("text").split(',');
    if (
      appState.candidateMoves.find(
        (el) => el[0] === rowDropped && el[1] === colDropped
      )
    ) {

      const newObject = JSON.parse(JSON.stringify(currentPosition));
      if (
        (piece === "wp" && rowDropped === 7) ||
        (piece === "bp" && rowDropped === 0)
      ) {
        openPromotionBox({ rank, file, rowDropped, colDropped });
        return;
      }

      // castling happens
      if (piece.endsWith("r") || piece.endsWith("k")) {
        // right castling
        if (
          rowDropped === 7 &&
          colDropped === 6 &&
          piece.endsWith("k") &&
          appState.castleDirection[piece[0]] !== "none"
        ) {
          newObject[7][7] = "";
          newObject[rank][colDropped - 1] = `${piece[0]}r`;
        }

        //  left castling
        if (
          rowDropped === 7 &&
          colDropped === 2 &&
          piece.endsWith("k") &&
          appState.castleDirection[piece[0]] !== "none"
        ) {
          newObject[7][0] = "";
          newObject[rank][colDropped + 1] = `${piece[0]}r`;
        }

        updateCastlingState({ piece, file, rank });
      }

    

      const lostPieces=[];
      if(newObject[rowDropped][colDropped] ){
        lostPieces.push(newObject[rowDropped][colDropped]);
      } 
      newObject[rowDropped][colDropped] = piece;
      newObject[rank][file] = "";
      // const ab=
      const newMove=numberToCharacters(colDropped)+ Number(8-(rowDropped));
      
      let turn = socketState.users.filter(
        (el) => el != socketState.turn
      )[0];
      dispatch(makeNewMove({ newPosition: newObject, newMove, lostPieces, socketConnection: socketState.socketConnection, roomId,turn }));
      dispatch(clearCandidates({socketConnection: socketState.socketConnection,roomId}));
      // if (socketState.socketConnection) {
      //   const moveData = {
      //     newPosition: newObject,
      //     newMove,
      //     lostPieces,
      //     turn: appState.turn === 'w' ? 'b' : 'w', // Switch turns
      //     status: appState.status,
      //     promotionSquare: appState.promotionSquare,
      //     castleDirection: appState.castleDirection,
      //     movesList: [...appState.movesList, newMove], // Add the new move to the moves list
      //   };
  
      //   socketState.socketConnection.emit('move', moveData);
      // }
    }

  }



  return (
    <div 
    className='pieces'
    onDrop={onDrop}
    ref={ref} 
 
    // onDragOver isliye because bydefault ye chlta hai toh onDrop chlne nhi deta 
    onDragOver={(e)=>e.preventDefault()}
    >
        {currentPosition.map((r,rank)=>r.map((f,file)=>{
          return (
            currentPosition[rank][file]? 
            <Piece
            rank={rank}
            key={rank+'-'+file}
            file={file}
            piece={currentPosition[rank][file]}
            >

            </Piece>
            :null
           
          )
        }))}
    </div>
  )
}

export default Pieces
