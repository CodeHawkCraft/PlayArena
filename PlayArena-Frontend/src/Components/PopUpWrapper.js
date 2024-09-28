import { X } from "lucide-react";
const PopUpWrapper = ({props}) => {

  
  const title = props.title;
  const component = props.component;
  const show = props.show;
  const setShow = props.setShow;
  return (
    <div
      className={`
    fixed w-screen h-screen z-10 opacity-0 invisible bg-black/60 transition-all duration-300  top-0 left-0
    text-gray-700 ${show ? "!opacity-100  !visible" : ""}`}
    >
      <div
        className={`
          absolute -top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10 w-[400px] transition-all duration-300 ease-in-out
          px-8 py-4 border border-gray-800  bg-gray-200 rounded-lg shadow-lg ${
            show ? "!top-[30%] !-translate-x-1/2 !-translate-y-[30%]" : ""
          }`}
      >
        <div className="border-b-2 pb-3">{title}</div>
        <X
          className="h-6 w-6  top-[-5px] flex items-center cursor-pointer bg-white absolute border  -right-2  rounded-full"
          onClick={() => {
            setShow(false);
          }}
        />
        <div className="flex py-5 w-full justify-center items-center flex-col gap-4">
          {component}
        </div>
      </div>
    </div>
  );
};

export default PopUpWrapper;
