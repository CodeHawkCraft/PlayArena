import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../../contexts/Context';

const LostPlayers = () => {
  const { appState: { lostPieces } } = useAppContext();
const [lostPiecesObject,setLostPiecesObject]=useState({});
useEffect(()=>{
    lostPieces.forEach((el)=>{
        const newObject={...lostPiecesObject};
        if(newObject[el]){
            newObject[el]+=1;
        }
        else{
            newObject[el]=1;
        }
        setLostPiecesObject(newObject);
    })
},[lostPieces]);
  return (
<div className="relative   flex flex-col gap-3 ">
  <h1 className='text-center text-3xl'>{lostPieces.length==0?'No Lost Player' :'Lost Players' } </h1>
  
    {lostPieces.length>0?
      <div className="w-full h-full overflow-auto">
      <table className="w-full max-h-full  text-sm">
        <thead className="text-xs text-white uppercase bg-greenColor">
          <tr>
            <th scope="col" className="px-6 py-3">Players.</th>
            <th  className="px-6 py-3 wp lostPlayer"></th>
            <th  className="px-6 py-3 wr lostPlayer"></th>
            <th  className="px-6 py-3 wn lostPlayer"></th>
            <th  className="px-6 py-3 wb lostPlayer"></th>
            <th  className="px-6 py-3 wq lostPlayer"></th>
            <th  className="px-6 py-3 wk lostPlayer"></th>
          
          </tr>
        </thead>
        <tbody>
  
  
          <tr className={` border-b-2 border-black   bg-lightTealColor text-gray-700 `}>
              <td className="px-6 py-4     text-center  ">White Team</td>
              <td className="px-6 py-4     text-center  ">{lostPiecesObject?.wp?lostPiecesObject.wp : 0}</td>
              <td className="px-6 py-4     text-center  ">{lostPiecesObject?.wr?lostPiecesObject.wr : 0}</td>
              <td className="px-6 py-4     text-center  ">{lostPiecesObject?.wn?lostPiecesObject.wn : 0}</td>
              <td className="px-6 py-4     text-center  ">{lostPiecesObject?.wb?lostPiecesObject.wb : 0}</td>
              <td className="px-6 py-4     text-center  ">{lostPiecesObject?.wq?lostPiecesObject.wq : 0}</td>
              <td className="px-6 py-4     text-center  ">{lostPiecesObject?.wk?lostPiecesObject.wk : 0}</td>
  
          </tr>
          <tr className={` border-b-2 border-black   bg-lightTealColor text-gray-700 `}>
          <td className="px-6 py-4     text-center  ">Black Team</td>
          <td className="px-6 py-4     text-center  ">{lostPiecesObject?.bp?lostPiecesObject.bp : 0}</td>
              <td className="px-6 py-4     text-center  ">{lostPiecesObject?.br?lostPiecesObject.br : 0}</td>
              <td className="px-6 py-4     text-center  ">{lostPiecesObject?.bn?lostPiecesObject.bn : 0}</td>
              <td className="px-6 py-4     text-center  ">{lostPiecesObject?.bb?lostPiecesObject.bb : 0}</td>
              <td className="px-6 py-4     text-center  ">{lostPiecesObject?.bq?lostPiecesObject.bq : 0}</td>
              <td className="px-6 py-4     text-center  ">{lostPiecesObject?.bk?lostPiecesObject.bk : 0}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    
    : null}

</div>

  );
};

export default LostPlayers;
