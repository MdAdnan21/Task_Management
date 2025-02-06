import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useFetchData from './useFetchData';
import { MoreHorizontal } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBinFill } from 'react-icons/ri';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';

interface BoardTableDataProps {
  searchQuery: string;
}
export default function BoardTableData({
  searchQuery: initialSearchQuery,
}: BoardTableDataProps) {
  const { data: BoardData, isLoading } = useFetchData();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery); // State for search query

  // Delete Task Mutation

  const filteredTasks = BoardData?.filter((task) =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(filteredTasks);
  const DeleteTask = useMutation({
    mutationKey: ['delete-task'],
    mutationFn: async (id: { id: string }) => {
      const res = await axios.delete(`http://localhost:3001/task/${id.id}`, {
        withCredentials: true,
      });
      return res.data;
    },
    onMutate: async (deletedTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] }); // Cancel ongoing fetch
      const previousTasks = queryClient.getQueryData(['tasks']); // Get current tasks
      // Optimistically remove the task from the cache
      queryClient.setQueryData(['tasks'], (oldTasks: any) =>
        oldTasks?.filter((task: any) => task.id !== deletedTask.id)
      );
      return { previousTasks }; // Return snapshot in case we need rollback
    },
    onError: (_err, _deletedTask, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks); // Rollback on error
      toast.error('Error deleting task');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Refetch fresh data
    },
    onSuccess: () => {
      toast.success('Task deleted successfully');
    },
  });

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    console.log(handleSearchChange);
  };

  // Filter tasks based on search query and status
  const filterTasks = (tasks: any[], status: string) => {
    return tasks.filter(
      (task) =>
        task.status === status &&
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex gap-x-4'>
      {/* Search Input */}

      {/* To-Do Section */}
      <div className='border w-[400px] bg-[#F1F1F1] rounded-md h-[550px]'>
        <button className='p-2 bg-[#FAC3FF] w-fit rounded-lg px-4 font-medium ml-4 mt-2'>
          To-Do
        </button>
        <div className='w-full p-4 h-full border'>
          {Array.isArray(BoardData) && BoardData.length > 0 ? (
            filterTasks(BoardData, 'TODO').length > 0 ? (
              filterTasks(BoardData, 'TODO').map((task: any) => (
                <div
                  key={task.id}
                  className='mb-2 bg-white p-4 rounded-xl shadow-md border-gray-200 border'
                >
                  <div className='flex justify-between items-center p-2 rounded-lg'>
                    <p className='font-semibold'>{task.name}</p>
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal className='w-5 h-5 cursor-pointer' />
                      </PopoverTrigger>
                      <PopoverContent className='w-40'>
                        <AlertDialog>
                          <AlertDialogTrigger className='flex items-center gap-2 w-full'>
                            <BiSolidEditAlt size={18} />
                            <p className='text-sm'>Edit</p>
                          </AlertDialogTrigger>
                          <AlertDialogTrigger className='flex items-center gap-2 w-full mt-2'>
                            <RiDeleteBinFill
                              className='text-[#DA2F2F]'
                              size={18}
                            />
                            <p className='text-sm text-[#DA2F2F]'>Delete</p>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Do you want to delete this task?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                className='w-1/4'
                                onClick={() =>
                                  DeleteTask.mutate({ id: task.id })
                                }
                              >
                                Yes, I'm sure
                              </AlertDialogCancel>
                              <AlertDialogAction>
                                No, I'm good
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className='flex justify-between items-center p-2 mt-8'>
                    <p className='text-sm text-gray-500'>{task?.category}</p>
                    <p className='text-sm text-gray-500'>{task?.duedate}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex justify-center items-center h-3/4'>
                <p className='text-gray-500'>No Tasks in To-Do</p>
              </div>
            )
          ) : (
            <div className='flex justify-center items-center h-3/4'>
              <p className='text-gray-500'>No Tasks in To-Do</p>
            </div>
          )}
        </div>
      </div>

      {/* IN-PROGRESS Section */}
      <div className='border w-[400px] bg-[#F1F1F1] rounded-md h-[550px]'>
        <button className='p-2 bg-[#85D9F1] w-fit rounded-lg px-4 font-medium ml-4 mt-2'>
          IN-PROGRESS
        </button>
        <div className='w-full p-4 h-full border'>
          {Array.isArray(BoardData) && BoardData.length > 0 ? (
            filterTasks(BoardData, 'IN-PROGRESS').length > 0 ? (
              filterTasks(BoardData, 'IN-PROGRESS').map((task: any) => (
                <div
                  key={task.id}
                  className='mb-2 bg-white p-4 rounded-xl shadow-md border-gray-200 border'
                >
                  <div className='flex justify-between items-center p-2 rounded-lg'>
                    <p className='font-semibold'>{task.name}</p>
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal className='w-5 h-5 cursor-pointer' />
                      </PopoverTrigger>
                      <PopoverContent className='w-40'>
                        <AlertDialog>
                          <AlertDialogTrigger className='flex items-center gap-2 w-full'>
                            <BiSolidEditAlt size={18} />
                            <p className='text-sm'>Edit</p>
                          </AlertDialogTrigger>
                          <AlertDialogTrigger className='flex items-center gap-2 w-full mt-2'>
                            <RiDeleteBinFill
                              className='text-[#DA2F2F]'
                              size={18}
                            />
                            <p className='text-sm text-[#DA2F2F]'>Delete</p>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Do you want to delete this task?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                className='w-1/4'
                                onClick={() =>
                                  DeleteTask.mutate({ id: task.id })
                                }
                              >
                                Yes, I'm sure
                              </AlertDialogCancel>
                              <AlertDialogAction>
                                No, I'm good
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className='flex justify-between items-center p-2 mt-8'>
                    <p className='text-sm text-gray-500'>{task?.category}</p>
                    <p className='text-sm text-gray-500'>{task?.duedate}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex justify-center items-center h-3/4'>
                <p className='text-gray-500'>No Tasks in In-Progress</p>
              </div>
            )
          ) : (
            <div className='flex justify-center items-center h-3/4'>
              <p className='text-gray-500'>No Tasks in In-Progress</p>
            </div>
          )}
        </div>
      </div>

      {/* COMPLETED Section */}
      <div className='border w-[400px] bg-[#F1F1F1] rounded-md h-[550px]'>
        <button className='p-2 bg-[#A2D6A0] w-fit rounded-lg px-4 font-medium ml-4 mt-2'>
          COMPLETED
        </button>
        <div className='w-full p-4 h-full border'>
          {Array.isArray(BoardData) && BoardData.length > 0 ? (
            filterTasks(BoardData, 'COMPLETED').length > 0 ? (
              filterTasks(BoardData, 'COMPLETED').map((task: any) => (
                <div
                  key={task.id}
                  className='mb-2 bg-white p-4 rounded-xl shadow-md border-gray-200 border'
                >
                  <div className='flex justify-between items-center p-2 rounded-lg'>
                    <p className='font-semibold line-through'>{task.name}</p>
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal className='w-5 h-5 cursor-pointer' />
                      </PopoverTrigger>
                      <PopoverContent className='w-40'>
                        <AlertDialog>
                          <AlertDialogTrigger className='flex items-center gap-2 w-full'>
                            <BiSolidEditAlt size={18} />
                            <p className='text-sm'>Edit</p>
                          </AlertDialogTrigger>
                          <AlertDialogTrigger className='flex items-center gap-2 w-full mt-2'>
                            <RiDeleteBinFill
                              className='text-[#DA2F2F]'
                              size={18}
                            />
                            <p className='text-sm text-[#DA2F2F]'>Delete</p>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Do you want to delete this task?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                className='w-1/4'
                                onClick={() =>
                                  DeleteTask.mutate({ id: task.id })
                                }
                              >
                                Yes, I'm sure
                              </AlertDialogCancel>
                              <AlertDialogAction>
                                No, I'm good
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className='flex justify-between items-center p-2 mt-8'>
                    <p className='text-sm text-gray-500'>{task?.category}</p>
                    <p className='text-sm text-gray-500'>{task?.duedate}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex justify-center items-center h-3/4'>
                <p className='text-gray-500'>No Tasks in Completed</p>
              </div>
            )
          ) : (
            <div className='flex justify-center items-center h-3/4'>
              <p className='text-gray-500'>No Tasks in Completed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
