import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/_auth/auth/login')({
  component: Login,
});

function Login() {
  return (
    // <div className='flex w-full h-screen items-center bg-gray-50'>
    //   {/* Left Content */}
    //   <div className='flex flex-col justify-center w-1/2 ml-32'>
    //     <div className='flex items-center gap-x-2'>
    //       <img src='/login/task.png' alt='Task Icon' className='w-12 h-12' />
    //       <h1 className='text-4xl font-bold text-[#7B1984]'>TaskBuddy</h1>
    //     </div>
    //     <p className='mt-2 px-2 text-lg  w-[55%]'>
    //       Streamline your workflow and track progress effortlessly with our
    //       all-in-one task management app.
    //     </p>
    //     <button className='mt-8 flex items-center justify-center gap-x-3 w-64 py-3 bg-black text-white font-medium text-base rounded-lg shadow-md hover:bg-gray-800'>
    //       <img
    //         src='/icons/google-icon.png'
    //         alt='Google Icon'
    //         className='w-5 h-5'
    //       />
    //       Continue with Google
    //     </button>
    //   </div>

    //   {/* Right Content */}
    //   <div className='relative flex items-center justify-center w-1/2 h-full'>
    //     {/* Background Image (Circles) */}
    //     <img
    //       src='/login/circles.png'
    //       alt='Background Circles'
    //       className='absolute w-full h-full object-contain'
    //     />

    //     {/* Task List Image */}
    //     <img
    //       src='/login/Tasklist.png'
    //       alt='Task List'
    //       className=' w-[90%] ml-52  h-[86%] z-10'
    //     />
    //   </div>
    // </div>
    <div className='flex w-full h-screen items-center bg-[#FFF9F9] fixed'>
      {/* Left Content */}
      <div className='flex flex-col justify-center w-1/2 ml-32'>
        {/* App Branding */}
        <div className='flex items-center gap-x-3'>
          <img src='/login/task.png' alt='Task Icon' className='w-12 h-12' />
          <h1 className='text-4xl font-bold text-purple-700'>TaskBuddy</h1>
        </div>
        {/* Description */}
        <p className='mt-4 text-lg text-gray-600 leading-relaxed w-[55%]'>
          Streamline your workflow and track progress effortlessly with our
          all-in-one task management app.
        </p>
        {/* Google Login Button */}
        <button className='mt-8 flex items-center justify-center gap-x-3 w-64 py-3 bg-black text-white font-medium text-base rounded-lg shadow-md transition-all hover:bg-gray-800'>
          <img
            src='/icons/google-icon.png'
            alt='Google Icon'
            className='w-5 h-5'
          />
          Continue with Google
        </button>
      </div>

      {/* Right Content */}
      <div className='relative flex items-center justify-center w-1/2  h-full'>
        {/* Background Circles Image */}
        <img
          src='/login/circles.png'
          alt='Background Circles'
          className='absolute w-full h-full top-8 object-cover'
        />
        {/* Task List Image */}
        <img
          src='/login/Tasklist.png'
          alt='Task List'
          // className='relative w-[60%] h-auto ml-28 z-10'
          className=' w-[90%] ml-52  h-[86%] z-10'
        />
      </div>
    </div>
  );
}
