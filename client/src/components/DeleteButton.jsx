 import React from "react";

const DeleteButton = ({onClick}) => {
  return (
    <button onClick={onClick} className="px-3 py-1 rounded-full border-[1px] border-sky-800 hover:border-sky-500 hover:shadow-xl  transition-all duration-150">
      <img src="/trash.png" alt="trash" className="w-4 h-4" />
    </button>
  );
};

export default DeleteButton;
