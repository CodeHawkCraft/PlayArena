import React from 'react'
import { useAppContext } from '../../../../contexts/Context';
import { makeNewMove } from '../../../../reducer/actions/move';
import { closePopup } from '../../../../helpers';
import { clearCandidates } from '../../../../reducer/actions/move';
const PromotionBox = () => {
  const options = ["q", "r", "b", "n"];
  const color='b';
  const { appState, dispatch } = useAppContext();
  const { promotionSquare } = appState;
 
  const onClick = (option) => {
    dispatch(closePopup())
    const newPosition = JSON.parse(JSON.stringify(
      appState.position[appState.position.length - 1]
    ));

    newPosition[promotionSquare.rank][promotionSquare.file] = "";
    newPosition[promotionSquare.rowDropped][promotionSquare.colDropped] = color + option;

    dispatch(makeNewMove({ newPosition, newPosition, lostPieces: appState.lostPieces}));
    dispatch(clearCandidates());
  };

  return (
    <div className='popup--inner flex gap-5 flex-col p-5'>
      <h1 className='text-black text-2xl text-center'>Promotion Happens </h1>
    <div className='promotion-choices'>
         {options.map((option) => (
        <div
        onClick={() => onClick(option)}
          key={option}
          className={`piece h-full  ${color}${option}`}
        />
      ))}
    </div>
    </div>
  )
}

export default PromotionBox
