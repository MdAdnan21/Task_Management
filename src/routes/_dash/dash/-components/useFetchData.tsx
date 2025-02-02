import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function useFetchData() {
  const TodoData = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3001/task', {
        withCredentials: true,
      });
      return res.data;
    },
  });
  return TodoData;
}
