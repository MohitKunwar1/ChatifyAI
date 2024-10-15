import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const Home = () => {
  const [typingStatus, setTypingStatus] = useState("human1");
  return (
    <div className="homepage flex items-center gap-[100px] h-full">
      <img
        src="homepage.jpg"
        alt="backgroundimage"
        className="absolute bottom-0 left-0 opacity-25 
      animate-pulse-slow h-full"
      />
      <div className="left flex-1 flex flex-col items-center justify-center gap-[16px]  text-center z-10">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-pink-600 bg-clip-text text-transparent ">
          CHATIFY AI
        </h1>
        <h2 className="text-2xl font-semibold max-w-[90%]">
          Supercharge your creativity and productivity.
        </h2>
        <h3>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum dolore
          odit adipisci alias repellat, cum ratione minus amet iusto aliquid,
          blanditiis omnis molestias? Dolor, aut vel tempora recusandae
          distinctio deleniti.
        </h3>

        <Link
          to="/dashboard"
          className="animate-border inline-block rounded-full bg-white bg-gradient-to-r from-blue-500 via-violet-600 to-pink-600 bg-[length:400%_400%] px-[2px] py-[2px]"
        >
          <span className="block rounded-full bg-slate-900 px-5 py-3 font-semibold text-lg">
            Get Started
          </span>
        </Link>
      </div>
      <div className="right flex-1 h-full flex  items-center justify-center z-10 ">
        <div className="relative w-[80%] h-[50%] flex items-center justify-center rounded-lg  bg-[#140e2d] ">
          <div className="bgBox w-full h-full overflow-hidden absolute  ">
            <div className="bgImage animate-slideBg  "></div>
          </div>
          <img
            src="/rb_69078.png"
            alt="image"
            className=" w-[25rem] h-[25rem] object-cover shadow-xl animate-botAnimate"
          />
          <div className="chatAnimation absolute -bottom-4 right-2 flex items-center gap-2 py-1 px-2 bg-neutral-500/30 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl">
            <img
              src={
                typingStatus === "human1"
                  ? "human1.jpg"
                  : typingStatus === "human2"
                  ? "human2.jpg"
                  : "logo1.png"
              }
              alt="user"
              className="w-8 h-8 rounded-full object-cover"
            />
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Human : Hello! Who are you?",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot : Hi there! I’m CHATIFY AI, your AI assistant.",
                2000,
                2000,
                () => {
                  setTypingStatus("human2");
                },
                "Human2 : Are you here to help me?",
                2000,
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot: Absolutely! I’m here to assist you with any questions.",
                2000,
                () => {
                  setTypingStatus("human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="footer absolute  bottom-5 left-[50%] -translate-x-[50%] flex flex-col items-center gap-3">
        <img src="logo.png" alt="logo" className="w-5 h-5  " />
        <div className="flex items-center  gap-3">
          <Link
            to="/"
            className="text-gray-500 text-xs hover:text-gray-300 duration-200"
          >
            Terms of service
          </Link>
          <span className="text-gray-500">|</span>
          <Link
            to="/"
            className="text-gray-500 text-xs pr-3 hover:text-gray-300 duration-200"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
