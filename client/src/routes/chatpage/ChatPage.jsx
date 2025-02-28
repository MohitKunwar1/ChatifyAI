import React from "react";
import NewPrompt from "../../components/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className="relative chatPage h-[100%] flex flex-col items-center">
      <div className="wrapper flex-1 overflow-scroll no-scrollbar w-[100%] flex justify-center">
        <div className="chats w-[70%] flex flex-col gap-5 leading-relaxed">
          {isPending
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data?.history?.map((message, i) => (
                <React.Fragment key={i}>
                  {message.image && (
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_URLENDPOINT}
                      path={message.image}
                      height="200"
                      width="300"
                      transformation={[{ height: 200, width: 300 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                      className="rounded-lg shadow-xl"
                    />
                  )}
                  <div
                    className={`${
                      message.role === "user" ? "userMessage" : "message"
                    }`}
                  >
                    <Markdown>{message.parts[0].text}</Markdown>
                  </div>
                </React.Fragment>
              ))}
          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
