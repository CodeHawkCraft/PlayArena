import actionTypes from "./actionTypes";
import { Status } from "../helpers";
import socketContext, { useSocketContext } from "../contexts/SocketContext";
export const reducer = (state, action) => {
    const { socketConnection, roomId,turn } = action.payload || {};
    let updatedState = { ...state };
    // console.log('reducer run bro----->');
    
    switch (action.type) {
        case actionTypes.NEW_MOVE: {
            const { newPosition, newMove, lostPieces: newLostPieces } = action.payload;
            const { position, movesList, turn, lostPieces } = updatedState;

            updatedState = {
                ...updatedState,
                position: [...position, newPosition],
                movesList: [...movesList, newMove],
                lostPieces: newLostPieces.length ? [...lostPieces, ...newLostPieces] : lostPieces,
                turn: turn === 'w' ? 'b' : 'w',
            };

            break;
        }

        case actionTypes.GENERATE_CANDIDATE_MOVES: {
            const { candidateMoves } = action.payload;
            updatedState = { ...updatedState, candidateMoves };
            break;
        }

        case actionTypes.PROMOTION_OPEN: {
            updatedState = {
                ...updatedState,
                status: Status.promoting,
                promotionSquare: { ...action.payload },
            };
            break;
        }

        case actionTypes.CLEAR_CANDIDATE_MOVES: {
            updatedState = { ...updatedState, candidateMoves: [] };
            // console.log('updatedState after clear candidate is -----> ',updatedState);
            
            break;
        }

        case actionTypes.PROMOTION_CLOSE: {
            updatedState = {
                ...updatedState,
                status: Status.ongoing,
                promotionSquare: null,
            };
            break;
        }

        case actionTypes.CAN_CASTLE: {
            const { turn, castleDirection } = updatedState;
            updatedState = {
                ...updatedState,
                castleDirection: {
                    ...castleDirection,
                    [turn]: action.payload,
                },
            };
            break;
        }

        case actionTypes.TAKE_BACK: {
            const { position, movesList, lostPieces, turn } = updatedState;

            if (position.length > 1) {
                updatedState = {
                    ...updatedState,
                    position: position.slice(0, -1),
                    movesList: movesList.slice(0, -1),
                    lostPieces: lostPieces.slice(0, -1),
                    turn: turn === 'w' ? 'b' : 'w',
                };
            }
            break;
        }

        case 'SET_DATA': {
            // this event is for other user player set data
            updatedState = { ...action.payload };
            return updatedState;
        }

        default:
            return state;
    }

    if(roomId && socketConnection){
          socketConnection.emit('move',{roomId,gamesData:updatedState,turn});
    }

    
    return updatedState;
};



export const socketReducer=(state,action)=>{
    console.log('action is ----> ',action);
    
   if(action.type==='connection'){
    const object= {
        socketConnection:action.payload
    }
    return object;
   }
   if(action.type==='sendData'){
    return {
        ...state,
        ...action.payload
    }
   }
   if(action.type==='updateGame'){
    return {
        ...state,
        ...action.payload
    }
   }
}