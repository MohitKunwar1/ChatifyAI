import React, { useEffect, useRef, useState } from "react";
import Upload from "./Upload";
import { IKImage } from "imagekitio-react";
import model from "../lib/gemini.js";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [image, setImage] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const endRef = useRef(null);
  const formRef = useRef(null);

  const chat = model.startChat({
    history: data?.history?.map(({ role, parts }) => ({
      role: role || "user", 
      parts: [{ text: parts[0]?.text || "" }],
    })) || [],
    generationConfig: {
      // maxOutputTokens: 1000,
    },
  });



  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data, answer, question, image.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          image: image.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImage({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(image.aiData).length ? [image.aiData, text] : [text]
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;

        setAnswer(accumulatedText);
      }

      mutation.mutate();
    } catch (error) {
      console.log(error);
      res.status(500).send("Error at new prompt!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    add(text, false);
  };

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {image.isLoading && (
        <p className="text-lg font-semibold animate-border bg-gradient-to-r from-blue-500 via-violet-600 to-pink-600 bg-[length:400%_400%] bg-clip-text text-transparent ">
          Loading...
        </p>
      )}
      {image.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_URLENDPOINT}
          path={image.dbData?.filePath}
          width="280"
          transformation={[{ width: 280 }]}
          className="rounded-lg"
        />
      )}
      {question && <div className="userMessage">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div ref={endRef} className="endChat pb-[100px]"></div>
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="newForm w-[70%] absolute bottom-0 left-[15%] bg-slate-800 rounded-full flex items-center gap-[20px] px-[20px] mb-[10px]"
      >
        <Upload setImage={setImage} />
        <input type="file" name="file" id="file" multiple={false} hidden />
        <input
          type="text"
          name="text"
          placeholder="Ask anything....."
          autoComplete="off"
          className="bg-transparent flex-1 p-[20px] outline-none text-[#ececec]"
        />
        <button className="bg-slate-700 rounded-full p-[10px] flex items-center justify-center ">
          <img src="/arrow.png" alt="arraow" className="w-[16px] h-[16px]" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
