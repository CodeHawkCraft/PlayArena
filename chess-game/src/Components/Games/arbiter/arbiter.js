import { getKnightMoves, getRookMoves,getBishopsMoves,getQueenMoves,getKingMoves,getPawnMoves } from "./getMoves";
const arbiter={

    getRegularMoves : function ({position,piece,rank,file,previousPosition,castleDirection}) {
        if (piece.endsWith('n')){
            return getKnightMoves(position,piece,rank,file);
        }
        else if (piece.endsWith('b')){
            return getBishopsMoves(position,piece,rank,file);
        }
        else if (piece.endsWith('r')){
            return getRookMoves(position,piece,rank,file);
        }
        else if (piece.endsWith('q')){
            return getQueenMoves(position,piece,rank,file);
        }
        else if (piece.endsWith('k')){
            return getKingMoves(position,piece,rank,file,previousPosition,castleDirection);
        }
        else if (piece.endsWith('p')){
            return getPawnMoves(position,piece,rank,file,previousPosition);
        }
    },
    getValidMoves:function ({position,piece,rank,file,previousPosition,castleDirection}){
        let moves=this.getRegularMoves({position,piece,rank,file,previousPosition,castleDirection});    
        // check for checkmate
        const enemy = piece[0].startsWith('w') ? 'b' : 'w'
        const atLastMoves=[];
        moves.forEach((move,i)=>{
            const positionAfterPerformMove=this.PerformMove({position,move,piece,rank,file});
            const getKindPosition=this.getKingPosition(position,piece[0]);
            const enemyPieces = this.getPieces(positionAfterPerformMove,enemy)
           let finalOutput= enemyPieces.some((el)=>{
                let output=[...this.getRegularMoves({position:positionAfterPerformMove,piece:el.piece,rank:el.rank,file:el.file,previousPosition,castleDirection})]
                const result=output.some ((el) =>{
                    return (getKindPosition[0] === el[0] && getKindPosition[1] === el[1])
                });
                return result;
            })

            if(!finalOutput){
                atLastMoves.push(move);
            }
        })
        return atLastMoves;
    },

    PerformMove:function ({position,move,piece,rank,file}){
        // console.log('p');
        const copyPosition=JSON.parse(JSON.stringify(position));
        copyPosition[move[0]][move[1]]=piece;
        copyPosition[rank][file]='';
        return copyPosition;
    },

     getKingPosition : (position, player) => {
        let kingPos 
        position.forEach((rank,x) => {
            rank.forEach((file, y) => {
                if(position[x][y].startsWith(player) && position[x][y].endsWith('k'))
                    kingPos=[x,y]
            })
        })
        return kingPos
    },

 getPieces: (position, enemy) => {
    const enemyPieces = []
    position.forEach((rank,x) => {
        rank.forEach((file, y) => {
            if(position[x][y].startsWith(enemy))
                enemyPieces.push({
                    piece : position[x][y],
                    rank : x,
                    file : y,
                })
        })
    })
    return enemyPieces
}


}

export default arbiter; // arbiter is judge of chess 