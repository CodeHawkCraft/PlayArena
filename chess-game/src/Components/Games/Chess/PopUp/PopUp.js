import React from 'react'
import PromotionBox from './PromotionBox';
import { useAppContext } from '../../../../contexts/Context';
import { Status } from '../../../../helpers';
const PopUp = () => {
  const { appState : {status} } = useAppContext();
  if (status === Status.ongoing)
    return null
  return (
    <div className='popup'>
        <PromotionBox></PromotionBox>
    </div>
  )
}

export default PopUp
