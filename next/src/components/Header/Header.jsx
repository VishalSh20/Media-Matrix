"use client"
import { useRouter } from "next/navigation";
import {UserButton,useAuth} from "@clerk/nextjs";


export default function Header() {
    const {user,isSignedIn} = useAuth();
    const allTabs = ["Home", "Features", "Pricing", "Contact"];
    const router = useRouter();
    return (
        <div className="flex justify-between w-full p-4 mb-4 header">
            <h2 className="text-2xl font-bold text-violet-400">Media-Matrix</h2>
            <div className="flex gap-4">
                {allTabs.map((tab) => (
                    <a href={`/${tab.toLowerCase()}`} key={tab} className={` hover:text-gray-800 hover:scale-105 transition-all duration-200 ${tab === "Home" ? "text-violet-400" : "text-gray-600"} `}>
                        {tab}
                    </a>
                ))}
            </div>
                {
                    isSignedIn ? (
                        <UserButton />
                    ) : (
                        <div className="flex gap-4">
            <button 
            className="bg-violet-400 text-white px-4 py-2 rounded-md hover:bg-violet-500 transition-all duration-200"
                onClick={()=>{
                    router.push("/sign-in")
                }}
            >
                Login
            </button>
            <button 
            className="bg-violet-400 text-white px-4 py-2 rounded-md hover:bg-violet-500 transition-all duration-200"
                onClick={()=>{
                    router.push("/sign-up")
                }}
            >
                        Sign Up
                    </button>
                </div>
            )}
        </div>
    )
}