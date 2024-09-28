import React from 'react';
import { useAppContext } from '../../../contexts/Context';

const MovesList = () => {
  const { appState: { movesList } } = useAppContext();
  
  return (
    <div className="relative max-h-[300px]  overflow-auto flex flex-col gap-3 ">
      <h1 className="text-center text-3xl"> {movesList.length==0? 'No Moves Taken':'Moves'}  </h1>

    {movesList.length>0 ? 
    
    <div className="overflow-auto ">

          <table className="w-full  overflow-y-scroll ">
            <thead className=" text-white uppercase  bg-greenColor ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Sr. No.
                </th>
                <th scope="col" className="px-6 py-3">
                  Black Player Team
                </th>
                <th scope="col" className="px-6 py-3">
                  <span> White Player Team</span>
                 
                </th>
              </tr>
            </thead>
            <tbody>
              {movesList.map((num, index) => {
                return index % 2 === 0 ? (
                  <tr
                    key={index}
                    className={` border-b-2 border-black   bg-lightTealColor text-gray-700 `}
                  >
                    <td className="px-6 py-4    text-center  ">
                      {Math.floor(index / 2) + 1}
                    </td>
                    <td className="px-6 py-4 text-center">{num}</td>

                    <td className="px-6 py-4  text-center">
                      {movesList[index + 1] ? movesList[index + 1] : null}
                    </td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
       
      </div>
    :null}
      
    </div>
  );
};

export default MovesList;
