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
import ListTableData from './dash/-components/ListTableData';
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
  category: z.enum(['WORK', 'PERSONAL']).optional(),
});
export const Route = createFileRoute('/_dash/')({
  component: Index,
  validateSearch: validator,
});

function Index() {
  const AddTask = useMutation({
    mutationKey: ['add-task'],
    mutationFn: async (val: any) => {
      const res = await axios.post('http://localhost:3001/task', {
        name: val?.name,
        duedate: val?.duedate,
        status: val?.status,
        category: val?.category,
      });
      return res.data;
    },
  });

  const form = useForm({
    defaultValues: {
      name: '',
      duedate: '',
      status: undefined,
      category: undefined, // Default category
    },
    resolver: zodResolver(validator),
  });

  const onSubmit = async (data: any) => {
    try {
      await AddTask.mutateAsync({
        name: data.name,
        duedate: data.duedate,
        status: data.status,
        category: data.category,
      });
      form.reset();
      console.log('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  console.log(AddTask.data);

  if (AddTask.isPending) {
    return <div>Loading...</div>;
  }

  if (AddTask.isError) {
    return <div>Error: {AddTask.error?.message}</div>;
  }

  return (
    <div className='p-5 mt-5 space-y-5'>
      {/* Header Section */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-x-2'>
          <img src='/login/task_icon.png' alt='Task Icon' className='w-8 h-8' />
          <h1 className='text-2xl font-semibold text-gray-800'>TaskBuddy</h1>
        </div>

        {/* User Info */}
        <div className='flex items-center gap-x-2'>
          {/* <img
            src={FetchData.data?.profileImage || '/default-avatar.png'}
            alt='User Profile'
            className='w-10 h-10 rounded-full border border-gray-300'
          />
          <p className='text-lg font-medium text-gray-700'>
            {FetchData.data?.name || 'No Name Available'}
          </p> */}
        </div>
      </div>

      {/* Tabs & Logout Button */}
      <div className='flex justify-between items-start w-full'>
        {/* Tabs Section */}
        <div className='flex-1'>
          <Tabs defaultValue='account' className='w-full'>
            <TabsList className='p-3 border-b border-gray-200'>
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
            </TabsList>

            <div className='flex items-center gap-x-2 p-2 rounded-lg cursor-pointer shadow-md border border-primary'>
              <BiLogOut size={24} />
              <p className='font-medium'>Logout</p>
            </div>

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
                {/* <Select>
                  <SelectTrigger className='w-[120px] rounded-3xl'>
                    <SelectValue placeholder='Due Date' />
                  </SelectTrigger>
                  <SelectContent>
                    <input type='date' className='p-2 w-full' />
                  </SelectContent>
                </Select> */}
                <Input
                  type='date'
                  placeholder='Due Date'
                  {...form.register('duedate', {
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
                  />
                </div>

                <AlertDialog>
                  <AlertDialogTrigger className='bg-primary px-4 py-2 text-white rounded-full font-medium w-40'>
                    ADD TASK
                  </AlertDialogTrigger>

                  <AlertDialogContent className='max-w-[600px] w-full p-6 rounded-lg shadow-lg'>
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
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-5'
                      >
                        {/* Task Title Input */}
                        <div>
                          <Label className='text-sm font-medium'>
                            Task Title
                          </Label>
                          <Input
                            placeholder='Enter task title...'
                            {...form.register('name', {
                              required: 'Task Title is required',
                            })}
                            className='w-full mt-1 border-gray-300 rounded-lg'
                          />
                          {form.formState.errors.name && (
                            <p className='text-red-500 text-sm mt-1'>
                              {form.formState.errors.name.message}
                            </p>
                          )}
                        </div>

                        {/* Category, Due Date, and Status (All in One Line) */}
                        <div className='flex items-center gap-4'>
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
                                    form.watch('category') === category
                                      ? 'bg-primary text-white'
                                      : 'bg-gray-100'
                                  }`}
                                  onClick={() =>
                                    form.setValue('category', category as any, {
                                      shouldValidate: true,
                                    })
                                  }
                                >
                                  {category}
                                </button>
                              ))}
                            </div>
                            {form.formState.errors.category && (
                              <p className='text-red-500 text-sm mt-1'>
                                {form.formState.errors.category.message}
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
                              {...form.register('duedate', {
                                required: 'Due Date is required',
                              })}
                              className='border p-2 rounded-lg mt-1'
                            />
                            {form.formState.errors.duedate && (
                              <p className='text-red-500 text-sm mt-1'>
                                {form.formState.errors.duedate.message}
                              </p>
                            )}
                          </div>

                          {/* Task Status */}
                          <div className='flex-1'>
                            <Label className='text-sm font-medium'>
                              Task Status
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                form.setValue('status', value as any, {
                                  shouldValidate: true,
                                })
                              }
                              value={form.watch('status')}
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
                            {form.formState.errors.status && (
                              <p className='text-red-500 text-sm mt-1'>
                                {form.formState.errors.status.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Footer Buttons */}
                        <AlertDialogFooter className='mt-4 flex justify-end gap-3'>
                          <AlertDialogCancel className='border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100'>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            type='submit'
                            className='bg-primary text-white px-4 py-2 rounded-md'
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
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
                <h2 className='text-lg font-semibold mb-4'>Manage Board</h2>
                <p className='text-gray-500'>Change your password here.</p>
                {/* {Array.isArray(FetchData.data) && FetchData.data.length > 0 ? (
                  <div className='mt-4'>
                    {FetchData.data.map((user) => (
                      <div key={user.id} className='mb-4'>
                        <h3 className='font-semibold'>{user.name}</h3>
                        <p>{user.duedate}</p>
                        <p>{user.category}</p>
                        <p>{user.status}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No users found.</p>
                )} */}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
export default Index;
