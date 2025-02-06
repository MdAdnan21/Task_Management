import { createFileRoute } from '@tanstack/react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { BiLogOut } from 'react-icons/bi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { LuSearch } from 'react-icons/lu';
import ListTableData from './-components/ListTableData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import FileUpload from '@/components/global/ImageUploader';
import { useAuth } from '../../../routes/_auth/auth/-components/authContext';
import BoardTableData from './-components/BoardTableData';
import { UserType } from './-components/useFetchData';
import { Link } from '@tanstack/react-router';

const validator = z.object({
  name: z
    .string()
    .min(5, 'Task name must be at least 5 characters long')
    .optional(),
  duedate: z
    .string()
    .min(8, 'Due date must be in a valid format (YYYY-MM-DD)')
    .optional(),
  status: z.enum(['TODO', 'IN-PROGRESS', 'COMPLETED']).optional(),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters long')
    .optional(),
  category: z.enum(['WORK', 'PERSONAL']).optional(),
});

export const Route = createFileRoute('/_dashboard/dash/')({
  component: Index,
  validateSearch: validator,
});

function Index() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      duedate: '',
      status: 'TODO' as 'TODO' | 'IN-PROGRESS' | 'COMPLETED' | undefined,
      category: 'WORK' as 'WORK' | 'PERSONAL' | undefined,
      description: '',
    },
    resolver: zodResolver(validator),
  });

  const AddTask = useMutation({
    mutationKey: ['add-task'],
    mutationFn: async (taskData: UserType) => {
      const res = await axios.post('http://localhost:3001/task', taskData);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Task created successfully');
      reset(); // Reset the form after successful submission
    },
    onError: (error: any) => {
      toast.error('Failed to create task');
      console.error('Error creating task:', error);
    },
  });

  const onSubmit = (data: any) => {
    AddTask.mutate(data); // Submit the form data to the API
  };

  return (
    <div className='p-5 mt-5 space-y-5'>
      {/* Header Section */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-x-2'>
          <img src='/login/task_icon.png' alt='Task Icon' className='w-8 h-8' />
          <h1 className='text-2xl font-semibold text-gray-800'>TaskBuddy</h1>
        </div>
      </div>

      {/* Tabs & Logout Button */}
      <div className='flex justify-between items-start w-full'>
        {/* Tabs Section */}
        <div className='flex-1'>
          <Tabs defaultValue='account' className='w-full'>
            <TabsList className='p-3 border-b border-gray-200 flex justify-between items-center'>
              {/* Left Side - Tabs */}
              <div className='flex gap-x-4'>
                <TabsTrigger value='account'>
                  <div className='flex items-center gap-x-2'>
                    <img
                      src='/login/Vector1.png'
                      alt='List Icon'
                      className='w-4 h-4'
                    />
                    <p className='text-lg font-medium'>List</p>
                  </div>
                </TabsTrigger>

                <TabsTrigger value='password'>
                  <div className='flex items-center gap-x-2'>
                    <img
                      src='/login/Vector.png'
                      alt='Board Icon'
                      className='w-4 h-4'
                    />
                    <p className='text-lg font-medium'>Board</p>
                  </div>
                </TabsTrigger>
              </div>

              {/* Right Side - User Info */}
              {user ? (
                <div className='flex items-center gap-x-3 p-3 rounded-lg cursor-pointer shadow-lg mb-10 ml-auto bg-white '>
                  {/* User Avatar */}
                  {/* <img
                    src={user.photoURL || '/default-user.png'}
                    alt='User Avatar'
                    className='w-10 h-10 rounded-full border border-gray-300'
                  /> */}

                  {/* User Info and Logout Button */}
                  <div className='flex flex-col'>
                    <p className='font-medium'>{user.displayName || 'User'}</p>
                    <button
                      onClick={logout}
                      className='flex items-center gap-x-2 text-red-500 font-medium hover:text-red-700 transition-all'
                    >
                      <BiLogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to='/auth/login'
                  className='bg-blue-500 text-white px-4 py-2 rounded-full font-semibold ml-auto shadow-md transition-all hover:bg-blue-600'
                >
                  Logged In
                </Link>
              )}
            </TabsList>

            {/* Filter Section */}
            <div className='mt-4 w-full flex justify-between items-center px-3'>
              <div className='flex items-center gap-x-4 w-full'>
                <p className='text-gray-700 font-medium'>Filter By:</p>
                <Select>
                  <SelectTrigger className='w-[120px] rounded-3xl'>
                    <SelectValue placeholder='Category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='work'>WORK</SelectItem>
                    <SelectItem value='personal'>PERSONAL</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type='date'
                  placeholder='Due Date'
                  {...register('duedate', {
                    required: 'Due Date is required',
                  })}
                  className='border p-2 rounded-lg w-40 mt-1'
                />
              </div>

              {/* Search Section */}
              <div className='flex items-center gap-x-4'>
                <div className='relative'>
                  <LuSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
                  <Input
                    placeholder='Search'
                    className='pl-10 w-52 h-10 border rounded-full'
                    onChange={handleSearchChange}
                    value={searchQuery}
                  />
                </div>

                <AlertDialog>
                  <AlertDialogTrigger className='bg-primary px-4 py-2 text-white rounded-full font-medium w-40'>
                    ADD TASK
                  </AlertDialogTrigger>

                  <AlertDialogContent className='max-w-[800px] h-[750px] p-6 rounded-lg shadow-lg'>
                    {/* Modal Header */}
                    <div className='flex justify-between items-center border-b pb-3'>
                      <AlertDialogTitle className='text-xl font-semibold'>
                        Create Task
                      </AlertDialogTitle>
                      <AlertDialogCancel className='p-2 hover:bg-gray-200 rounded-full'>
                        <X className='w-5 h-5' />
                      </AlertDialogCancel>
                    </div>

                    <AlertDialogDescription className='mt-4'>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='space-y-5'
                      >
                        {/* Task Title Input */}
                        <div>
                          <Label className='text-sm font-medium'>
                            Task Title
                          </Label>
                          <Input
                            placeholder='Enter task title...'
                            {...register('name')}
                            className='w-full mt-1 border-gray-300 rounded-lg'
                          />
                          {errors.name && (
                            <p className='text-red-500 text-sm mt-1'>
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        {/* Task Description Input */}
                        <div>
                          <Label className='text-sm font-medium'>
                            Task Description
                          </Label>
                          <textarea
                            {...register('description')}
                            className='w-full mt-1 border-gray-300 border rounded-lg p-2'
                            rows={4}
                          />
                          {errors.description && (
                            <p className='text-red-500 text-sm mt-1'>
                              {errors.description.message}
                            </p>
                          )}
                        </div>

                        {/* Task Category, Due Date, and Status */}
                        <div className='flex items-center gap-4 py-4'>
                          {/* Task Category */}
                          <div className='flex-1'>
                            <Label className='text-sm font-medium'>
                              Task Category
                            </Label>
                            <div className='flex gap-2 mt-1'>
                              {['WORK', 'PERSONAL'].map((category) => (
                                <button
                                  key={category}
                                  type='button'
                                  className={`border w-24 p-2 rounded-full transition-colors ${
                                    watch('category') === category
                                      ? 'bg-[#7B1984] text-white'
                                      : 'bg-gray-100'
                                  }`}
                                  onClick={() =>
                                    setValue(
                                      'category',
                                      category as 'WORK' | 'PERSONAL'
                                    )
                                  }
                                >
                                  {category}
                                </button>
                              ))}
                            </div>
                            {errors.category && (
                              <p className='text-red-500 text-sm mt-1'>
                                {errors.category.message}
                              </p>
                            )}
                          </div>

                          {/* Due Date */}
                          <div className='flex-1'>
                            <Label className='text-sm font-medium'>
                              Due On
                            </Label>
                            <Input
                              type='date'
                              {...register('duedate')}
                              className='border p-2 rounded-lg mt-1'
                            />
                            {errors.duedate && (
                              <p className='text-red-500 text-sm mt-1'>
                                {errors.duedate.message}
                              </p>
                            )}
                          </div>

                          {/* Task Status */}
                          <div className='flex-1'>
                            <Label className='text-sm font-medium'>
                              Task Status
                            </Label>
                            <Select
                              onValueChange={(value: string) =>
                                setValue(
                                  'status',
                                  value as
                                    | 'TODO'
                                    | 'IN-PROGRESS'
                                    | 'COMPLETED'
                                    | undefined
                                )
                              }
                              value={watch('status')}
                            >
                              <SelectTrigger className='w-full mt-1 border-gray-300 rounded-lg'>
                                <SelectValue placeholder='Choose' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='TODO'>TODO</SelectItem>
                                <SelectItem value='IN-PROGRESS'>
                                  IN-PROGRESS
                                </SelectItem>
                                <SelectItem value='COMPLETED'>
                                  COMPLETED
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.status && (
                              <p className='text-red-500 text-sm mt-1'>
                                {errors.status.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* File Upload Section */}
                        <FileUpload />

                        {/* Footer Buttons */}
                        <div className='mt-8'>
                          <AlertDialogFooter className='flex justify-end gap-3'>
                            <AlertDialogCancel className='border px-4 py-2 rounded-full'>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              type='submit'
                              className='bg-primary text-white px-6 py-2 rounded-full bg-[#7B1984]'
                            >
                              Create
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </div>
                      </form>
                    </AlertDialogDescription>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Tabs Content (Full Width) */}
            <div className='mt-5 w-full px-3'>
              <TabsContent value='account'>
                <h2 className='text-lg font-semibold mb-4'>User List</h2>
                <ListTableData />
              </TabsContent>

              <TabsContent value='password'>
                <BoardTableData searchQuery={searchQuery} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
export default Index;
