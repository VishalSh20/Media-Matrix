import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
  <div className='flex flex-col items-center justify-center h-screen'>
    <div className='flex flex-col p-4 bg-gray-300 font-mono text-black items-center justify-start'>
        <h2 className='text-2xl'>Welcome back!</h2>
        <SignIn 
            signUpUrl='/sign-up'
            routing='path'
        />
    </div>
  </div>)
}