import { createFileRoute } from '@tanstack/react-router';
import SignInWithGoogle from './-components/SignInGoogle';

export const Route = createFileRoute('/_auth/auth/login')({
  component: Login,
});

function Login() {
  return (
    <div className='flex flex-col md:flex-row w-full h-screen bg-[#FFF9F9]'>
      {/* Left Content */}
      <div className='flex flex-col justify-center items-center md:items-start w-full md:w-1/2 p-8 md:pl-20 lg:pl-40'>
        {/* Logo and App Name */}
        <div className='flex items-center gap-x-3'>
          <img src='/login/task.png' alt='Task Icon' className='w-12 h-12' />
          <h1 className='text-4xl font-bold text-[#7B1984]'>TaskBuddy</h1>
        </div>

        {/* Tagline */}
        <p className='mt-4 text-center md:text-left text-lg text-gray-600 w-full md:w-[80%] lg:w-[64%]'>
          Streamline your workflow and track progress effortlessly with our
          all-in-one task management app.
        </p>

        {/* Google Sign-In Button */}
        <div className='mt-8 w-full md:w-[80%] lg:w-[64%]'>
          <SignInWithGoogle />
        </div>
      </div>

      {/* Right Content */}
      <div className='relative flex items-center justify-center w-full md:w-1/2 h-full bg-[#F8F8F8]'>
        {/* Background Circles Image */}
        <img
          src='/login/circles.png'
          alt='Background Circles'
          className='absolute w-full h-full top-0 left-0 object-cover'
        />

        {/* Task List Image */}
        <img
          src='/login/Tasklist.png'
          alt='Task List'
          className='relative w-[90%] md:w-[80%] lg:w-[70%] h-auto z-10'
        />
      </div>
    </div>
  );
}
