import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { ZodError } from 'zod';

export function getErrorMessage(err: unknown) {
  let message: string = '';

  if (isAxiosError(err)) {
    message = err.response?.data?.error?.message || err?.message;
  } else if (err instanceof ZodError) {
    message = err.issues[0].message;
  } else if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === 'string') {
    message = err;
  } else if (err && typeof err === 'object' && 'message' in err) {
    message = String(err.message);
  }
  return message;
}

export function throwError(err: unknown) {
  let message: string = '';

  if (isAxiosError(err)) {
    message = err.response?.data?.error?.message || err?.message;
  } else if (err instanceof ZodError) {
    message = err.issues[0].message;
  } else if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === 'string') {
    message = err;
  } else if (err && typeof err === 'object' && 'message' in err) {
    message = String(err.message);
  }

  toast.error(message);
}
