import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
<div className='flex flex-col items-center justify-center h-screen'>
    <div className='flex flex-col p-4 mt-8 bg-gray-300 font-mono text-black items-center justify-start'>
        <h2 className='text-2xl'>Welcome aboard!</h2>
        <SignUp
            signInUrl='/sign-in'
            routing='path'
        />
    </div>
  </div>)}