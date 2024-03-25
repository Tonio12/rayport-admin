"use client";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="text-blue-900 flex flex-grow h-min min-h-min justify-between">
      <h2>
        Hello, <b>{session?.user?.name}</b>
      </h2>

      <div className="flex gap-1 text-black bg-gray-300 rounded-lg overflow-hidden pr-1">
        <img src={session?.user?.image} alt="" className="w-6 h-6" />
        <h2>{session?.user?.name}</h2>
      </div>
    </div>
  );
}
