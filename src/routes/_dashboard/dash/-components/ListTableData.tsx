import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BsPlusCircle } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';
import { GripVertical, MoreHorizontal, CircleCheck } from 'lucide-react';
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBinFill } from 'react-icons/ri';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import clsx from 'clsx';
import useFetchData from './useFetchData';

export default function ListTableData() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [openAccordions, setOpenAccordions] = useState({
    task: true,
    inProgress: true,
    completed: true,
  });
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const { data: TaskData } = useFetchData();
  console.log(TaskData);
  const queryClient = useQueryClient();
  const { register } = useForm();
  const { data: UserData } = useFetchData();

  const toggleDropdown = (index: number) => {
    if (selectedRowIndex === index) {
      setSelectedRowIndex(null);
    } else {
      setSelectedRowIndex(index);
    }
  };

  const handleSelectStatus = (status: string) => {
    setSelectedStatus(status);
    setSelectedRowIndex(null);
  };

  const handleCheckboxChange = (taskId: number) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(taskId)
        ? prevSelected.filter((id) => id !== taskId)
        : [...prevSelected, taskId]
    );
  };

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
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
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
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (oldTasks: any) =>
        oldTasks?.filter((task: any) => task.id !== deletedTask.id)
      );
      return { previousTasks };
    },
    onError: (_err, _deletedTask, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
      toast.error('Error deleting task');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onSuccess: () => {
      toast.success('Task deleted successfully');
    },
  });

  const getTaskCount = (status: string) => {
    return UserData?.filter((task: any) => task.status === status).length || 0;
  };

  return (
    <div className='w-full'>
      <div className='w-full'>
        <form>
          {/* TODO Accordion */}
          <Accordion
            type='single'
            collapsible
            value={openAccordions.task ? 'task' : ''}
            onValueChange={(value) =>
              setOpenAccordions((prev) => ({ ...prev, task: value === 'task' }))
            }
            className='w-full'
          >
            <AccordionItem value='task'>
              <AccordionTrigger className='bg-[#FAC3FF] p-4 rounded-t-2xl w-full'>
                <div className='flex items-center gap-x-2'>
                  <span>Task</span>
                  <span className='text-sm text-gray-500'>
                    ({getTaskCount('TODO')})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className='w-full'>
                <Table className='w-full'>
                  <TableBody>
                    {/* Add Task Row */}
                    <TableRow>
                      <TableCell className='flex gap-x-1 items-center font-semibold text-left'>
                        <FiPlus size={20} />
                        <span>ADD TASK</span>
                      </TableCell>
                    </TableRow>

                    {/* Input Fields */}
                    <TableRow>
                      <TableCell className='font-medium text-left'>
                        Task Title
                      </TableCell>
                      <TableCell>
                        <Select>
                          <SelectTrigger className='w-[140px] rounded-3xl flex items-center gap-x-0.5'>
                            <img
                              src='/list/calender.svg'
                              alt='Calendar'
                              className='w-6 h-6'
                            />
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
                                {...register('duedate')}
                              />
                            </div>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center space-x-2'>
                          <div className='relative'>
                            <BsPlusCircle
                              size={30}
                              onClick={() => toggleDropdown(0)}
                              style={{ cursor: 'pointer' }}
                            />
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
                          {selectedStatus && (
                            <span className='text-xl font-semibold'>
                              {selectedStatus}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center space-x-2'>
                          <div className='relative'>
                            <BsPlusCircle
                              size={30}
                              onClick={() => toggleDropdown(0)}
                              style={{ cursor: 'pointer' }}
                            />
                            {selectedRowIndex === 0 && (
                              <div className='absolute left-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg w-48'>
                                <ul className='space-y-2 p-2'>
                                  {['WORK', 'PERSONAL'].map((status) => (
                                    <li
                                      key={status}
                                      className='cursor-pointer hover:bg-gray-100 rounded'
                                      onClick={() => handleSelectStatus(status)}
                                    >
                                      {status}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          {selectedStatus && (
                            <span className='text-xl font-semibold'>
                              {selectedStatus}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='text-center'>
                        <button className='p-2 rounded-md text-gray-600 hover:bg-gray-100'>
                          <MoreHorizontal className='w-5 h-5' />
                        </button>
                      </TableCell>
                    </TableRow>

                    {/* Task Rows */}
                    {Array.isArray(UserData) && UserData.length > 0 ? (
                      UserData.map(
                        (item, index) =>
                          item?.status === 'TODO' && (
                            <TableRow key={index}>
                              <TableCell className='font-medium flex items-center gap-x-1 text-left'>
                                <input
                                  type='checkbox'
                                  className='w-5 h-5'
                                  checked={selectedTasks.includes(
                                    Number(item?.id)
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(Number(item?.id))
                                  }
                                />
                                <GripVertical className='w-5 h-5 text-gray-500 cursor-pointer' />
                                <div className='flex items-center gap-2'>
                                  <CircleCheck
                                    className={clsx(
                                      'w-6 h-6 rounded-full border-2',
                                      item?.status === 'TODO'
                                        ? 'text-gray-400 outline-none'
                                        : 'text-gray-400'
                                    )}
                                  />
                                </div>
                                <span className='text-left'>{item?.name}</span>
                              </TableCell>
                              <TableCell className='font-medium text-left'>
                                {item?.duedate}
                              </TableCell>
                              <TableCell className='font-medium'>
                                <Popover>
                                  <PopoverTrigger>
                                    <div className='font-medium p-2 rounded-lg bg-[#DDDADD] flex items-center'>
                                      <p className='w-full'>{item?.status}</p>
                                    </div>
                                  </PopoverTrigger>
                                </Popover>
                              </TableCell>
                              <TableCell className='font-medium text-center'>
                                {item?.category}
                              </TableCell>
                              <TableCell className='text-center'>
                                <Popover>
                                  <PopoverTrigger>
                                    <MoreHorizontal className='w-5 h-5' />
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <AlertDialog>
                                      <AlertDialogTrigger className='flex items-center gap-2'>
                                        <BiSolidEditAlt size={22} />
                                        <p className='text-lg font-medium'>
                                          Edit
                                        </p>
                                      </AlertDialogTrigger>
                                      <AlertDialogTrigger className='flex items-center gap-2 mt-2'>
                                        <RiDeleteBinFill
                                          className='text-[#DA2F2F]'
                                          size={22}
                                        />
                                        <p className='text-[#DA2F2F] text-lg font-medium'>
                                          Delete
                                        </p>
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
                                              DeleteTask.mutate({ id: item.id })
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
                              </TableCell>
                            </TableRow>
                          )
                      )
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className='text-center text-gray-500'
                        >
                          No tasks in Todo
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* IN-PROGRESS Accordion */}
          <Accordion
            type='single'
            collapsible
            value={openAccordions.inProgress ? 'inProgress' : ''}
            onValueChange={(value) =>
              setOpenAccordions((prev) => ({
                ...prev,
                inProgress: value === 'inProgress',
              }))
            }
            className='w-full mt-5'
          >
            <AccordionItem value='inProgress'>
              <AccordionTrigger className='bg-[#85D9F1] p-4 rounded-t-2xl w-full'>
                <div className='flex items-center gap-x-2'>
                  <span>IN-PROGRESS</span>
                  <span className='text-sm text-gray-500'>
                    ({getTaskCount('IN-PROGRESS')})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className='w-full'>
                <Table className='w-full'>
                  <TableBody>
                    {Array.isArray(UserData) &&
                      UserData.map(
                        (item, index) =>
                          item?.status === 'IN-PROGRESS' && (
                            <TableRow key={index}>
                              <TableCell className='font-medium flex items-center gap-x-1'>
                                <input
                                  type='checkbox'
                                  className='w-5 h-5'
                                  checked={selectedTasks.includes(
                                    Number(item?.id)
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(Number(item?.id))
                                  }
                                />
                                <GripVertical className='w-5 h-5 text-gray-500 cursor-pointer' />
                                <div className='flex items-center gap-2'>
                                  <CircleCheck
                                    className={clsx(
                                      'w-6 h-6 rounded-full',
                                      item?.status === 'IN-PROGRESS'
                                        ? 'text-gray-400 border-0'
                                        : 'text-gray-400'
                                    )}
                                  />
                                </div>
                                <p className='ml-3'>{item?.name}</p>
                              </TableCell>
                              <TableCell className='font-medium'>
                                {item?.duedate}
                              </TableCell>
                              <TableCell className='font-medium'>
                                <Popover>
                                  <PopoverTrigger>
                                    <div className='font-medium p-2 rounded-lg bg-[#DDDADD] flex items-center'>
                                      <p className='w-full'>{item?.status}</p>
                                    </div>
                                  </PopoverTrigger>
                                </Popover>
                              </TableCell>
                              <TableCell className='font-medium text-center'>
                                {item?.category}
                              </TableCell>
                              <TableCell className='text-center'>
                                <Popover>
                                  <PopoverTrigger>
                                    <MoreHorizontal className='w-5 h-5' />
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <AlertDialog>
                                      <AlertDialogTrigger className='flex items-center gap-2'>
                                        <BiSolidEditAlt size={22} />
                                        <p className='text-lg font-medium'>
                                          Edit
                                        </p>
                                      </AlertDialogTrigger>
                                      <AlertDialogTrigger className='flex items-center gap-2 mt-2'>
                                        <RiDeleteBinFill
                                          className='text-[#DA2F2F]'
                                          size={22}
                                        />
                                        <p className='text-[#DA2F2F] text-lg font-medium'>
                                          Delete
                                        </p>
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
                                              DeleteTask.mutate({ id: item.id })
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
                              </TableCell>
                            </TableRow>
                          )
                      )}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* COMPLETED Accordion */}
          <Accordion
            type='single'
            collapsible
            value={openAccordions.completed ? 'completed' : ''}
            onValueChange={(value) =>
              setOpenAccordions((prev) => ({
                ...prev,
                completed: value === 'completed',
              }))
            }
            className='w-full mt-5'
          >
            <AccordionItem value='completed'>
              <AccordionTrigger className='bg-[#CEFFCC] p-4 rounded-t-2xl w-full'>
                <div className='flex items-center gap-x-2'>
                  <span>Completed</span>
                  <span className='text-sm text-gray-500'>
                    ({getTaskCount('COMPLETED')})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className='w-full'>
                <Table className='w-full'>
                  <TableBody>
                    {Array.isArray(UserData) &&
                      UserData.map(
                        (item, index) =>
                          item?.status === 'COMPLETED' && (
                            <TableRow key={index}>
                              <TableCell className='font-medium flex items-center gap-x-1'>
                                <input
                                  type='checkbox'
                                  className='w-5 h-5'
                                  checked={selectedTasks.includes(
                                    Number(item?.id)
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(Number(item?.id))
                                  }
                                />
                                <GripVertical className='w-5 h-5 text-gray-500 cursor-pointer' />
                                <div className='flex items-center gap-2'>
                                  <CircleCheck
                                    className={clsx(
                                      'w-6 h-6 rounded-full',
                                      item?.status === 'COMPLETED'
                                        ? 'bg-[#1B8D17] text-white border-0'
                                        : 'text-gray-400'
                                    )}
                                  />
                                </div>
                                <p className='ml-3 line-through'>
                                  {item?.name}
                                </p>
                              </TableCell>
                              <TableCell className='font-medium'>
                                {(() => {
                                  const today = new Date()
                                    .toISOString()
                                    .split('T')[0];
                                  return item?.duedate === today
                                    ? 'Today'
                                    : item?.duedate;
                                })()}
                              </TableCell>
                              <TableCell className='font-medium'>
                                <Popover>
                                  <PopoverTrigger>
                                    <div className='font-medium p-2 rounded-lg bg-[#DDDADD] flex items-center'>
                                      <p className='w-full'>{item?.status}</p>
                                    </div>
                                  </PopoverTrigger>
                                </Popover>
                              </TableCell>
                              <TableCell className='font-medium text-center'>
                                {item?.category}
                              </TableCell>
                              <TableCell className='text-center'>
                                <Popover>
                                  <PopoverTrigger>
                                    <MoreHorizontal className='w-5 h-5' />
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <AlertDialog>
                                      <AlertDialogTrigger className='flex items-center gap-2'>
                                        <BiSolidEditAlt size={22} />
                                        <p className='text-lg font-medium'>
                                          Edit
                                        </p>
                                      </AlertDialogTrigger>
                                      <AlertDialogTrigger className='flex items-center gap-2 mt-2'>
                                        <RiDeleteBinFill
                                          className='text-[#DA2F2F]'
                                          size={22}
                                        />
                                        <p className='text-[#DA2F2F] text-lg font-medium'>
                                          Delete
                                        </p>
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
                                              DeleteTask.mutate({ id: item.id })
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
                              </TableCell>
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
