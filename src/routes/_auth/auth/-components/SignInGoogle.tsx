import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebaseConfig'; // Ensure this path is correct
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export default function SignInWithGoogle() {
  const navigate = useNavigate();
  const handleSignIn = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User signed in:', result.user);
      if (result.user) {
        toast.success('User logged in successfully', {
          position: 'top-center',
        });
        // window.location.href = '/dash';
        navigate({
          to: '/dash',
        });
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <button
      className='mt-8 flex items-center justify-center gap-x-3 w-72 py-3 bg-black text-white font-medium text-base rounded-xl shadow-md transition-all hover:bg-gray-800'
      onClick={handleSignIn}
    >
      <img src='/login/google.png' alt='Google Icon' className='w-5 h-5' />
      <span className='font-bold'>Continue with Google</span>
    </button>
  );
}
