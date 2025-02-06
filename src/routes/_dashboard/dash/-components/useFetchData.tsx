import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface UserType {
  id: string;
  name: string;
  duedate: string;
  status: string;
  description: string;
  category: string;
}

export default function useFetchData() {
  const TodoData = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3001/task', {
        withCredentials: true,
      });
      return res.data as UserType[];
    },
  });
  return TodoData;
}
