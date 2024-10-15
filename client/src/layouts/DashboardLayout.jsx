import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ChatList from "../components/ChatList";
import { useAuth } from "@clerk/clerk-react";

const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded)
    return (
      <p className="text-lg text-center font-semibold animate-border bg-gradient-to-r from-blue-500 via-violet-600 to-pink-600 bg-[length:400%_400%] bg-clip-text text-transparent ">
        Loading...
      </p>
    );
  return (
    <div className="flex gap-[50px] pt-[20px] h-[100%]">
      <div className="menu flex-1">
        <ChatList />
      </div>
      <div className="content flex-[4] bg-slate-950 ">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
