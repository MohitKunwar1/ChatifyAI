import React from "react";
import { Link, Outlet } from "react-router-dom";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dark, neobrutalism, shadesOfPurple } from '@clerk/themes'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" appearance={{
      baseTheme: [shadesOfPurple]
    }}>
      <QueryClientProvider client={queryClient}>
      <div className="rootlayout py-[10px] px-[55px] h-[100vh] flex flex-col  ">
        <header className="flex items-center justify-between z-10 ">
          <Link to="/" className="flex items-center font-bold gap-[4px] ">
            <img src="/logo1.png" alt="logo" className="w-[40px] h-[40px]" />
            <span>CHATIFY AI</span>
          </Link>
          <div>
      <SignedIn>
        <UserButton />
      </SignedIn>
          </div>
        </header>
        <main className="flex-1 overflow-hidden ">
          <Outlet />
        </main>
      </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
