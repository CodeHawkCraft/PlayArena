import React from 'react';

const CircularLoading= ({  text }) => {
  return (
    <div className='w-full justify-center items-center gap-4 flex p-10'>
      <div 
       className={`w-14 h-14 border-4 rounded-full animate-spin`}
       style={{ borderColor: `${'red'} transparent transparent transparent` }} 
      ></div>
      {text && <h1 className='text-gray-400 text-2xl'>{text}</h1>}
    </div>
  );
};

export default CircularLoading;
