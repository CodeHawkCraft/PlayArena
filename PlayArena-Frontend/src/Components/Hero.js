import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Gamepad2 } from 'lucide-react'
const Hero = () => {
    const navigate = useNavigate();  // Get the navigate function

  return (
    <div className="h-screen  w-full">
      <div className="absolute w-full px-5 items-center flex flex-col gap-5 top-[45%] left-1/2 -translate-x-1/2 -translate-y-[45%]">
        <h1 className="uppercase text-center tracking-widest	 text-3xl">Battle with Friends, Rule the Game</h1>
        <button
          onClick={() => {
            navigate("/games");
          }}
          className="w-fit"
        >
          Play Games
        </button>
      </div>



      <nav className="absolute w-full flex  items-center  p-6  text-customLight">
      <Gamepad2 className="h-10 w-10 cursor-pointer" />
        <ul className="flex w-full px-6 justify-end gap-8">
          <li className="hoverUnderlineAnimation">
            <Link to={"games"}> PlayGames</Link>
          </li>
          <li className="hoverUnderlineAnimation">
            <Link> About</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Hero;
