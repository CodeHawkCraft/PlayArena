import actionTypes from '../actionTypes';
export const generateCandidates = ({candidateMoves}) => {
    return {
        type: actionTypes.GENERATE_CANDIDATE_MOVES,
        payload : {candidateMoves}
    }
}

export const clearCandidates = ({socketConnection,roomId}) => {
    return {
        type: actionTypes.CLEAR_CANDIDATE_MOVES,
        payload :{socketConnection,roomId}
    }
}

export const makeNewMove = ({newPosition,newMove,lostPieces,socketConnection,roomId,turn}) => {
   
    return {
        type: actionTypes.NEW_MOVE,
        payload: {newPosition,newMove,lostPieces,socketConnection,roomId,turn},
    }


}

