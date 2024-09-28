import actionTypes from "../reducer/actionTypes";
export const numberToCharacters=(no)=>String.fromCharCode(no+97);

export const getPositionArray=()=>{
    const position=Array(8).fill('').map((el,index)=>{
        if(index===1 || index===6){
          el=Array(8).fill(index===1?'wp':'bp')
        }
        else{
          el=Array(8).fill('')
        }
        return el;
      });
    
    
      position[0][0] = "wr";
      position[0][1] = "wn";
      position[0][2] = "wb";
      position[0][3] = "wq";
      position[0][4] = "wk";
      position[0][5] = "wb";
      position[0][6] = "wn";
      position[0][7] = "wr";
    
      position[7][0] = "br";
      position[7][1] = "bn";
      position[7][2] = "bb";
      position[7][3] = "bq";
      position[7][4] = "bk";
      position[7][5] = "bb";
      position[7][6] = "bn";
      position[7][7] = "br";
      return position;
}


export const Status = {
  'ongoing' : 'Ongoing',
  'promoting' : 'Promoting',
  'white' : 'White wins',
  'black' : 'Black wins',
  'stalemate' : 'Game draws due to stalemate',
  'insufficient' : 'Game draws due to insufficient material',
}


export const initGameState = {
  position : [getPositionArray()],
  turn : 'b',
  status : Status.ongoing,
  candidateMoves:[],
  promotionSquare : null,
  castleDirection:{
      w : 'both',
      b : 'both'
  },
  movesList : [],
  lostPieces:[],

}

export const socketInitialState={
  socketConnection:'',
  users:[],
  turn:'',
  currentUserName:'',
  gamesData:{}
}

export const openPromotion = ({rank,file,rowDropped,colDropped}) => {
  return {
      type: actionTypes.PROMOTION_OPEN,
      payload: {rank,file,rowDropped,colDropped}
  }
}


export const closePopup = () => {
  return {
      type: actionTypes.PROMOTION_CLOSE,
  }
}


export const updateCastling = (direction) => {
  return {
      type: actionTypes.CAN_CASTLE,
      payload: direction,
  }
}


export const takeBack = () => {
  return {
      type: actionTypes.TAKE_BACK,
  }
}

