"use client"
import { useRouter } from "next/navigation";
import {UserButton,useAuth} from "@clerk/nextjs";
import Link from "next/link";


export default function Header() {
    const {user,isSignedIn} = useAuth();
    const allTabs = ["Home", "Tools", "API", "Contact"];
    const router = useRouter();
    return (
            <nav className="flex w-full items-center justify-between p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
            <span className="text-xl font-bold">Media Matrix</span>
          </Link>
          <div className="flex items-center gap-6">
            {
                allTabs.map((tab,index)=>{
                    return(
                        <Link key={index} href={`/${tab.toLowerCase()}`} className="text-gray-400 hover:text-white">{tab}</Link>
                    )
                })
            }
            {
                isSignedIn ?
                <div className="flex gap-4 items-center">
                    <button
                    className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
                    onClick={()=>{
                        router.push("/workspace");
                    }}
                    >Workspace</button>
                    <UserButton />
                </div>
                :
                <div className="flex gap-4 items-center">
                    <Link href="/sign-up">
                        <button 
                        className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800">
                        Sign up
                        </button>
                    </Link>
                    <Link href="/sign-in">
                        <button
                        className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
                        >Sign in</button>
                    </Link>
                </div>
            }
                
          </div>
        </nav>
    )
}