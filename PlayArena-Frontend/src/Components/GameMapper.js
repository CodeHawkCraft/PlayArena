import React from "react";
import { useParams } from "react-router-dom";
import ChessBoard from "./Games/Chess/ChessBoard";
import { useNavigate } from "react-router-dom";
import LeaderBoard from "./Games/Chess/LeaderBoard";
import CircularLoading from "../helpers/Components/CircularLoading";
import { useSocketContext } from "../contexts/SocketContext";

const GameMapper = () => {
  const { id } = useParams();
  return (
    <>
      {id == "chess" && (
        <div className="min-h-full gameMapper  justify-center  p-4 lg:px-10  flex-col  lg:flex-row  flex  gap-4  w-full">
          <ChessBoard></ChessBoard>
          <LeaderBoard></LeaderBoard>
        </div>
      )}
    </>
  );
};

export default GameMapper;
