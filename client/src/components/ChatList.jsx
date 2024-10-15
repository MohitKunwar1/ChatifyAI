import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteButton from "./DeleteButton";
import DeletePopUp from "./DeletePopUp";

const ChatList = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const deleteChatMutation = useMutation({
    mutationFn: (chatId) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userChats"]);
      setShowDeletePopUp(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleDeleteChat = (chatId) => {
    deleteChatMutation.mutate(chatId);
    navigate("/dashboard")
  };

  return (
    <div className="chatList flex flex-col h-full relative">
      <span>DASHBOARD</span>
      <Link to="/dashboard" className="linkStyle">
        Create a new Chat
      </Link>
      <Link to="/" className="linkStyle">
        Explore ChatAI
      </Link>
      <Link to="/" className="linkStyle">
        Contact
      </Link>
      <hr className="border-none h-0.5 bg-gray-200/5 rounded-lg my-2.5" />
      <span className="font-semibold text-sm my-2.5">RECENT CHATS</span>
      <div className="flex flex-col overflow-scroll no-scrollbar h-fit">
        {isPending ? (
          "Loading..."
        ) : error ? (
          <p className="text-sm font-semibold text-red-500 pt-5">
            Something went wrong!
          </p>
        ) : !data || data.length === 0 ? (
          <p className="text-sm font-semibold text-white/30 pt-5">
            List is empty!
          </p>
        ) : (
          data.map((chat) => (
            <div key={chat._id}>
              <Link
                to={`/dashboard/chats/${chat._id}`}
                onClick={() => setSelectedChatId(chat._id)}
                className={`linkStyle flex items-center justify-between ${
                  selectedChatId === chat._id
                    ? "p-2 rounded-lg bg-gray-800 shadow-lg"
                    : ""
                }`}
              >
                {chat.title}
                {selectedChatId === chat._id && (
                  <DeleteButton
                    chatId={chat._id}
                    onClick={() => setShowDeletePopUp(true)}
                  />
                )}
              </Link>
              {showDeletePopUp && selectedChatId === chat._id && (
                <DeletePopUp
                  onCancel={() => setShowDeletePopUp(false)}
                  onDelete={() => handleDeleteChat(chat._id)}
                />
              )}
            </div>
          ))
        )}
      </div>
      <hr className="border-none h-0.5 bg-gray-200/5 rounded-lg my-5" />
      <div className="mt-auto flex items-center gap-2.5 text-sm">
        <img src="/logo1.png" alt="logo" className="w-8 h-8" />
        <div className="flex flex-col">
          <span className="text-white font-medium">Upgrade to ChatAI Pro</span>
          <span className="text-gray-500 text-xs">
            Get unlimited access to all features.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
