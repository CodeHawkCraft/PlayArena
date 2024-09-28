export const getRookMoves = (position,piece,rank,file) => {
    const directions=[
       [ -1,0], // for decreasing rowno or rank
        [1,0], // for increasing rowno or rank
        [0,-1], //for decreasing colno or file
        [0,1],// //for increasing colno or file
    ]
    const moves=[];
const us = piece[0]
    const enemy = us === 'w' ? 'b' : 'w'
    directions.forEach((direction)=>{
        for (let i = 1; i <= 8; i++) {
            const x = rank+(i*direction[0])
            const y = file+(i*(direction[1]))
            // this below confdition means out of box chala gya
            if(position?.[x]?.[y] === undefined)
                break
            if(position[x][y].startsWith(us)){
                break
            }
            if(position[x][y].startsWith(enemy)){
                moves.push ([x,y])
                break
            }
            moves.push ([x,y])
        }   
    })
    return moves;
}



export const getKnightMoves=(position,piece,rank,file)=>{
    const moves=[];
    const us = piece[0]
        const enemy = us === 'w' ? 'b' : 'w'
    const directions = [
      [-2, -1],
      [-2, 1],
      [-1, 2],
      [1, 2],
      [2, 1],
      [2, -1],
      [1, -2],
      [-1, -2],
    ];



    directions.forEach((direction)=>{
        const cell = position?.[rank+direction[0]]?.[file+direction[1]]
        if(cell !== undefined && (cell.startsWith(enemy) || cell === '')){
            moves.push ([rank+direction[0],file+direction[1]])
        }
    })
    return moves;
}


export const getBishopsMoves = (position,piece,rank,file) => {
    const directions=[
       [ -1,-1], // for decreasing rowno or rank
        [-1,1], // for increasing rowno or rank
        [1,1], //for decreasing colno or file
        [1,-1],// //for increasing colno or file
    ]
    const moves=[];
const us = piece[0]
    const enemy = us === 'w' ? 'b' : 'w'
   
    directions.forEach((direction)=>{
        for (let i = 1; i <= 8; i++) {
            const x = rank+(i*direction[0])
            const y = file+(i*(direction[1]))
            // this below confdition means out of box chala gya
            // console.log('(position?.[x]?.[y] is ----> ',(position?.[x]?.[y]), us);
            if(piece=='wb'){   
            }
            if(position?.[x]?.[y] === undefined)
                break
            if(position[x][y].startsWith(us)){
                break
            }

            if(position[x][y].startsWith(enemy)){
                moves.push ([x,y])
                break;
            }
            moves.push ([x,y])
        }   
    })

    // console.log('moves is -----> ',moves);
    
    return moves;
}

export const getQueenMoves = (position,piece,rank,file) => {
    const moves = [
        ...getBishopsMoves(position,piece,rank,file),
        ...getRookMoves(position,piece,rank,file)
    ]
    
    return moves
}


export const getKingMoves = (position,piece,rank,file,previousPosition,castleDirection) => {
    let moves = []
    const us = piece[0]
    const direction = [
        [1,-1], [1,0],  [1,1],
        [0,-1],         [0,1],
        [-1,-1],[-1,0], [-1,1],
    ]

    direction.forEach(dir => {
        const x = rank+dir[0]
        const y = file+dir[1]
        if(position?.[x]?.[y] !== undefined && !position[x][y].startsWith(us))
        moves.push ([x,y])
    })
    return [...moves,...getCastlingMoves(position,piece,rank,file,previousPosition,castleDirection)];
}

export const getCastlingMoves= (position,piece,rank,file,previousPosition,castleDirection) => {
    const moves=[];
    const us = piece[0]

    if(castleDirection[us]=='both'){
        if(position[rank][file+1]=='' && position[rank][file+2]==''){
            moves.push([rank,file+2]);
        }

        if(position[rank][file-1]=='' && position[rank][file-2]=='' && position[rank][file-3]==''){
            // moves.push([rank,file-3]);
            moves.push([rank,file-2]);
        } 
    }
    else if(castleDirection[us]=='right'){
        if(position[rank][file+1]=='' && position[rank][file+2]==''){
            moves.push([rank,file+2]);
        }
    }

    else if(castleDirection[us]=='left'){
        if(position[rank][file-1]=='' && position[rank][file-2]=='' && position[rank][file-3]==''){
            moves.push([rank,file-2]);
        }
    }


    return moves;
}

export const getPawnMoves = (position,piece,rank,file,previousPosition) => {
    const moves=[];
const us = piece[0]
const dir = piece==='wp' ? 1 : -1
    const enemy = us === 'w' ? 'b' : 'w'
    if (rank==6 || rank===1){
        if (position?.[rank+2*dir]?.[file] === ''){
            moves.push ([rank+dir,file])
            moves.push ([rank+dir+dir,file])
        }
    }
    else{
        if (position?.[rank+dir]?.[file] === ''){
            moves.push ([rank+dir,file])
        }
    }
    return [...moves,...getPawnCaptures(position,piece,rank,file,previousPosition)];
}


export const getPawnCaptures =  (position,piece,rank,file,previousPosition) => {

    const moves = []
    const dir = piece==='wp' ? 1 : -1
    const enemy = piece[0] === 'w' ? 'b' : 'w'

    // Capture enemy to left
    if (position?.[rank+dir]?.[file-1] && position[rank+dir][file-1].startsWith(enemy) ){
        moves.push ([rank+dir,file-1])
    }

    // Capture enemy to right
    if (position?.[rank+dir]?.[file+1] && position[rank+dir][file+1].startsWith(enemy) ){
        moves.push ([rank+dir,file+1])
    }


    // capture en passent rule
    if((dir==1 && rank==4) || (dir === -1 && rank === 3)){
        // console.log('c hit bro------>');
        
        const adjacentFiles = [file-1,file+1]
        adjacentFiles.forEach(f => {
            if (position?.[rank]?.[f][0] === enemy && 
                // position?.[rank+dir+dir]?.[f] === '' &&
                // prevPosition?.[rank]?.[f] === '' && 
                previousPosition?.[rank+dir+dir]?.[f][0] === enemy){
                    moves.push ([rank+dir,f])
                }
        })
    }
    return moves
}