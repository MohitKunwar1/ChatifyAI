import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      //INVALID AND REFETCH
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    
    mutation.mutate(text);
  };
  return (
    <div className="h-full flex flex-col items-center ">
      <div className=" flex-1 flex flex-col items-center justify-center w-[50%] gap-[50px] ">
        <div className="logo flex items-center gap-[20px] opacity-[0.2]">
          <img src="/logo.png" alt="logo" className="h-[64px] w-[64px]" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-pink-600 bg-clip-text text-transparent">
            CHATAI
          </h1>
        </div>
        <div className="options w-[100%] flex items-center justify-between gap-[50px]">
          <div className="option">
            <img src="/newchat.png" alt="newchat" />
            <span>Create a new chat</span>
          </div>
          <div className="option">
            <img src="/image analyze.png" alt="addimage" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="imageanalyze" />
            <span>Help me with my code</span>
          </div>
        </div>
      </div>
      <div className="formContainer mt-auto w-[70%] bg-slate-800 rounded-full flex mb-[10px]">
        <form
          onSubmit={handleSubmit}
          className="w-[100%] h-[100%] flex items-center justify-between gap-[20px] mb-[15px] "
        >
          <input
            type="text"
            name="text"
            placeholder="Ask Me Anything......"
            autoComplete="off"
            className="flex-1 p-[10px] bg-transparent outline-none ml-[10px] "
          />
          <button className="bg-slate-900 rounded-full p-[12px] flex items-center justify-center mr-[10px]">
            <img src="/arrow.png" alt="arraow" className="w-[16px] h-[16px]" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
