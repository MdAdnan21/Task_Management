import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { FiPlus } from 'react-icons/fi';
import { BsPlusCircle } from 'react-icons/bs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';

import useFetchData from './useFetchData';
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
import { toast } from 'sonner';

export default function ListTableData() {
  // const validator = z.object({
  //   name: z.string().min(5, 'Task name must be 5 characters long'),
  //   duedate: z.string().min(8, 'Due date must be 8 characters long'),
  //   status: z.enum(['TODO', 'IN-PROGRESS', 'COMPLETED']),
  //   category: z.enum(['WORK', 'PERSONAL']),
  // });
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null); // Track which row's dropdown is open
  const queryClient = useQueryClient();
  // Handle click on the plus circle icon to show the dropdown
  const toggleDropdown = (index: number) => {
    if (selectedRowIndex === index) {
      setSelectedRowIndex(null); // Close if the clicked row is already open
    } else {
      setSelectedRowIndex(index); // Open the clicked row's dropdown
    }
  };

  // Handle selecting a status
  const handleSelectStatus = (status: string) => {
    setSelectedStatus(status);
    setSelectedRowIndex(null); // Close the dropdown after selection
  };

  const { register } = useForm();
  const { data: UserData } = useFetchData();
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // ✅ Refresh tasks list
      toast.success('Task added successfully');
    },
    onError: () => {
      toast.error('Error adding task');
    },
  });
  console.log(AddTask);

  const DeleteTask = useMutation({
    mutationKey: ['deleteuser'],
    mutationFn: async (id: { id: string }) => {
      const res = await axios.delete(`http://localhost:3001/task/${id.id}`, {
        withCredentials: true,
      });
      return res.data;
    },

    onMutate: async (deletedTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] }); // Cancel ongoing fetch

      const previousTasks = queryClient.getQueryData(['tasks']); // Get current tasks

      // **Optimistically remove the task from the cache**
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

  return (
    <div className='w-full'>
      {' '}
      {/* Ensures the content wrapper takes full width */}
      <div className='w-full'>
        {' '}
        {/* Make sure the parent container also takes full width */}
        <form>
          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem value='item-1'>
              {/* Accordion Trigger - This will be the clickable part */}
              <AccordionTrigger className='bg-[#FAC3FF] p-4 rounded-t-2xl w-full'>
                Task
              </AccordionTrigger>

              {/* Accordion Content - The Table will go inside this */}
              <AccordionContent className='w-full'>
                <Table className='w-full'>
                  <TableHeader>
                    <TableRow className='border-t'>
                      <TableHead>Task name</TableHead>
                      <TableHead>Due on</TableHead>
                      <TableHead>Task Status</TableHead>
                      <TableHead>Task Category</TableHead>
                      <TableHead className='text-center'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <TableRow>
                      <TableCell className='flex gap-x-1 items-center font-semibold'>
                        <FiPlus size={20} />
                        <span>ADD TASK</span>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className='font-medium'>Task Title</TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger className='w-[140px] rounded-3xl flex items-center gap-x-0.5'>
                            {/* First: Calendar Icon */}
                            <img
                              src='/list/calender.svg'
                              alt='Calendar'
                              className='w-6 h-6'
                            />

                            {/* Next: Due Date Placeholder */}
                            <SelectValue
                              placeholder='Due Date'
                              {...register('duedate')}
                            />
                          </SelectTrigger>

                          <SelectContent>
                            <div>
                              <input
                                type='date'
                                className='p-2 w-full'
                                {...register('duedate')} // Connect to form state
                              />
                            </div>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center space-x-2'>
                          {/* Plus Circle Icon */}
                          <div className='relative'>
                            <BsPlusCircle
                              size={30}
                              onClick={() => toggleDropdown(0)} // Pass row index to toggle the dropdown
                              style={{ cursor: 'pointer' }}
                            />

                            {/* Dropdown Menu */}
                            {selectedRowIndex === 0 && (
                              <div className='absolute left-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg w-48'>
                                <ul className='space-y-2 p-2'>
                                  {['TODO', 'IN-PROGRESS', 'COMPLETED'].map(
                                    (status) => (
                                      <li
                                        key={status}
                                        className='cursor-pointer hover:bg-gray-100 rounded'
                                        onClick={() =>
                                          handleSelectStatus(status)
                                        }
                                      >
                                        {status}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Display selected status next to the icon */}
                          {selectedStatus && (
                            <span className='text-xl font-semibold'>
                              {selectedStatus}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>Credit Card</TableCell>

                      <TableCell className='text-center'>
                        <button className='p-2 rounded-md text-gray-600 hover:bg-gray-100'>
                          <MoreHorizontal className='w-5 h-5' />
                        </button>
                      </TableCell>
                    </TableRow>

                    {Array.isArray(UserData) &&
                      UserData.map(
                        (item, index) =>
                          item?.status === 'TODO' && (
                            <TableRow key={index}>
                              <TableCell className='font-medium'>
                                {item?.name}
                              </TableCell>
                              <TableCell className='font-medium'>
                                {item?.category}
                              </TableCell>
                              <TableCell className='font-medium'>
                                {item?.duedate}
                              </TableCell>{' '}
                              {/* Fix typo "duadate" -> "duedate" */}
                              <TableCell className='font-medium'>
                                {item?.status === 'TODO' && item?.status}
                              </TableCell>
                              {/* <TableCell className='font-medium'>INV001</TableCell>
                      <TableCell>
                        <input
                          type='date'
                          className='p-2 w-full'
                        />
                      </TableCell>
                      <TableCell>Paid</TableCell>
                      <TableCell>Credit Card</TableCell> */}
                              <TableCell className='text-center'>
                                <button className='p-2 rounded-md text-gray-600 hover:bg-gray-100'>
                                  <MoreHorizontal className='w-5 h-5' />
                                </button>
                              </TableCell>
                              {/* <Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>Place content for the popover here.</PopoverContent>
</Popover> */}
                              <AlertDialog>
                                <AlertDialogTrigger>
                                  <AiFillDelete className='text-red-500' />
                                </AlertDialogTrigger>
                                <AlertDialogTrigger className='font-serif text-base font-medium'>
                                  Delete
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Do you want to delete this Public
                                      Documents
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      className='w-3/4'
                                      onClick={() =>
                                        DeleteTask.mutate({ id: item.id })
                                      }
                                    >
                                      Yes I m Sure
                                    </AlertDialogCancel>
                                    <AlertDialogAction>
                                      No, I m good
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableRow>
                          )
                      )}
                    {/* {Array.isArray(UserData) &&
                      UserData.map(
                        (item, index) =>
                          item?.status === 'COMPLETED' && (
                            <TableRow key={index}>
                              <TableCell className='font-medium'>
                                {item?.name}
                              </TableCell>
                              <TableCell className='font-medium'>
                                {item?.category}
                              </TableCell>
                              <TableCell className='font-medium'>
                                {item?.duedate}
                              </TableCell>{' '}
                              <TableCell className='font-medium'>
                                {item?.status === 'COMPLETED' && item?.status}
                              </TableCell>

                              <TableCell className='text-center'>
                                <button className='p-2 rounded-md text-gray-600 hover:bg-gray-100'>
                                  <MoreHorizontal className='w-5 h-5' />
                                </button>
                              </TableCell>

                              <AlertDialog>
                                <AlertDialogTrigger>
                                  <AiFillDelete className='text-red-500' />
                                </AlertDialogTrigger>
                                <AlertDialogTrigger className='font-serif text-base font-medium'>
                                  Delete
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Do you want to delete this Public
                                      Documents
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      className='w-3/4'
                                      onClick={() =>
                                        DeleteTask.mutate({ id: item.id })
                                      }
                                    >
                                      Yes I m Sure
                                    </AlertDialogCancel>
                                    <AlertDialogAction>
                                      No, I m good
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableRow>
                          )
                      )} */}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type='single' collapsible className='w-full  mt-5'>
            <AccordionItem value='item-1'>
              {/* Accordion Trigger - This will be the clickable part */}
              <AccordionTrigger className='bg-[#85D9F1] p-4 rounded-t-2xl w-full'>
                IN-PROGRESS
              </AccordionTrigger>

              {/* Accordion Content - The Table will go inside this */}
              <AccordionContent className='w-full'>
                <Table className='w-full'>
                  <TableHeader>
                    <TableRow className='border-t'>
                      <TableHead>Task name</TableHead>
                      <TableHead>Due on</TableHead>
                      <TableHead>Task Status</TableHead>
                      <TableHead>Task Category</TableHead>
                      <TableHead className='text-center'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <TableRow>
                      <TableCell className='flex gap-x-1 items-center font-semibold'>
                        <FiPlus size={20} />
                        <span>ADD TASK</span>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className='font-medium'>Task Title</TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger className='w-[140px] rounded-3xl flex items-center gap-x-0.5'>
                            {/* First: Calendar Icon */}
                            <img
                              src='/list/calender.svg'
                              alt='Calendar'
                              className='w-6 h-6'
                            />

                            {/* Next: Due Date Placeholder */}
                            <SelectValue
                              placeholder='Due Date'
                              {...register('duedate')}
                            />
                          </SelectTrigger>

                          <SelectContent>
                            <div>
                              <input
                                type='date'
                                className='p-2 w-full'
                                {...register('duedate')} // Connect to form state
                              />
                            </div>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center space-x-2'>
                          {/* Plus Circle Icon */}
                          <div className='relative'>
                            <BsPlusCircle
                              size={30}
                              onClick={() => toggleDropdown(0)} // Pass row index to toggle the dropdown
                              style={{ cursor: 'pointer' }}
                            />

                            {/* Dropdown Menu */}
                            {selectedRowIndex === 0 && (
                              <div className='absolute left-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg w-48'>
                                <ul className='space-y-2 p-2'>
                                  {['TODO', 'IN-PROGRESS', 'COMPLETED'].map(
                                    (status) => (
                                      <li
                                        key={status}
                                        className='cursor-pointer hover:bg-gray-100 rounded'
                                        onClick={() =>
                                          handleSelectStatus(status)
                                        }
                                      >
                                        {status}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Display selected status next to the icon */}
                          {selectedStatus && (
                            <span className='text-xl font-semibold'>
                              {selectedStatus}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>Credit Card</TableCell>

                      <TableCell className='text-center'>
                        <button className='p-2 rounded-md text-gray-600 hover:bg-gray-100'>
                          <MoreHorizontal className='w-5 h-5' />
                        </button>
                      </TableCell>
                    </TableRow>

                    {Array.isArray(UserData) &&
                      UserData.map(
                        (item, index) =>
                          item?.status === 'IN-PROGRESS' && (
                            <TableRow key={index}>
                              <TableCell className='font-medium'>
                                {item?.name}
                              </TableCell>
                              <TableCell className='font-medium'>
                                {item?.category}
                              </TableCell>
                              <TableCell className='font-medium'>
                                {item?.duedate}
                              </TableCell>{' '}
                              <TableCell className='font-medium'>
                                {item?.status === 'IN-PROGRESS' && item?.status}
                              </TableCell>
                              <TableCell className='text-center'>
                                <button className='p-2 rounded-md text-gray-600 hover:bg-gray-100'>
                                  <MoreHorizontal className='w-5 h-5' />
                                </button>
                              </TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger>
                                  <AiFillDelete className='text-red-500' />
                                </AlertDialogTrigger>
                                <AlertDialogTrigger className='font-serif text-base font-medium'>
                                  Delete
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Do you want to delete this Public
                                      Documents
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      className='w-3/4'
                                      onClick={() =>
                                        DeleteTask.mutate({ id: item.id })
                                      }
                                    >
                                      Yes I m Sure
                                    </AlertDialogCancel>
                                    <AlertDialogAction>
                                      No, I m good
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableRow>
                          )
                      )}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type='single' collapsible className='w-full  mt-5'>
            <AccordionItem value='item-1'>
              {/* Accordion Trigger - This will be the clickable part */}
              <AccordionTrigger className='bg-[#CEFFCC] p-4 rounded-t-2xl w-full'>
                Completed
              </AccordionTrigger>

              {/* Accordion Content - The Table will go inside this */}
              <AccordionContent className='w-full'>
                <Table className='w-full'>
                  <TableHeader>
                    <TableRow className='border-t'>
                      <TableHead>Task name</TableHead>
                      <TableHead>Due on</TableHead>
                      <TableHead>Task Status</TableHead>
                      <TableHead>Task Category</TableHead>
                      <TableHead className='text-center'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <TableRow>
                      <TableCell className='flex gap-x-1 items-center font-semibold'>
                        <FiPlus size={20} />
                        <span>ADD TASK</span>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className='font-medium'>Task Title</TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger className='w-[140px] rounded-3xl flex items-center gap-x-0.5'>
                            {/* First: Calendar Icon */}
                            <img
                              src='/list/calender.svg'
                              alt='Calendar'
                              className='w-6 h-6'
                            />

                            {/* Next: Due Date Placeholder */}
                            <SelectValue
                              placeholder='Due Date'
                              {...register('duedate')}
                            />
                          </SelectTrigger>

                          <SelectContent>
                            <div>
                              <input
                                type='date'
                                className='p-2 w-full'
                                {...register('duedate')} // Connect to form state
                              />
                            </div>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center space-x-2'>
                          {/* Plus Circle Icon */}
                          <div className='relative'>
                            <BsPlusCircle
                              size={30}
                              onClick={() => toggleDropdown(0)} // Pass row index to toggle the dropdown
                              style={{ cursor: 'pointer' }}
                            />

                            {/* Dropdown Menu */}
                            {selectedRowIndex === 0 && (
                              <div className='absolute left-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg w-48'>
                                <ul className='space-y-2 p-2'>
                                  {['TODO', 'IN-PROGRESS', 'COMPLETED'].map(
                                    (status) => (
                                      <li
                                        key={status}
                                        className='cursor-pointer hover:bg-gray-100 rounded'
                                        onClick={() =>
                                          handleSelectStatus(status)
                                        }
                                      >
                                        {status}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Display selected status next to the icon */}
                          {selectedStatus && (
                            <span className='text-xl font-semibold'>
                              {selectedStatus}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>Credit Card</TableCell>

                      <TableCell className='text-center'>
                        <button className='p-2 rounded-md text-gray-600 hover:bg-gray-100'>
                          <MoreHorizontal className='w-5 h-5' />
                        </button>
                      </TableCell>
                    </TableRow>

                    {Array.isArray(UserData) &&
                      UserData.map(
                        (item, index) =>
                          item?.status === 'COMPLETED' && (
                            <TableRow key={index}>
                              <TableCell className='font-medium'>
                                {item?.name}
                              </TableCell>
                              <TableCell className='font-medium'>
                                {item?.category}
                              </TableCell>
                              <TableCell className='font-medium'>
                                {item?.duedate}
                              </TableCell>{' '}
                              <TableCell className='font-medium'>
                                {item?.status === 'COMPLETED' && item?.status}
                              </TableCell>
                              <TableCell className='text-center'>
                                <button className='p-2 rounded-md text-gray-600 hover:bg-gray-100'>
                                  <MoreHorizontal className='w-5 h-5' />
                                </button>
                              </TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger>
                                  <AiFillDelete className='text-red-500' />
                                </AlertDialogTrigger>
                                <AlertDialogTrigger className='font-serif text-base font-medium'>
                                  Delete
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Do you want to delete this Public
                                      Documents
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      className='w-3/4'
                                      onClick={() =>
                                        DeleteTask.mutate({ id: item.id })
                                      }
                                    >
                                      Yes I m Sure
                                    </AlertDialogCancel>
                                    <AlertDialogAction>
                                      No, I m good
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableRow>
                          )
                      )}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
      </div>
    </div>
  );
}
