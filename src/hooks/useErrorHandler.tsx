// useErrorHandler.ts
import { useNavigate } from 'react-router-dom';
import {  isResponseError } from '../utils/customError';
import { ResponseStatus, Role } from '../interface/Interface';
import { Toast } from '../component/Toast2';

const useErrorHandler = (role: Role, setToast?: (toast: Toast) => void) => {
  const navigate = useNavigate();
  const navigationLink = role === Role.users ? '/login' : `/${role}/login`;
  const handleError = (error: unknown) => {
    if (isResponseError(error)) {
      switch (error.statusCode) {
        case 500: 
          setToast?setToast({
            alert: ResponseStatus.ERROR,
            message: error.data.message,
          }): null
          break;
        case 403:
          navigate(navigationLink, { replace: true, state: { blocked: true } });
          break;
        case 401:
          navigate(navigationLink, { replace: true });
          break;
        case 400:
          setToast?setToast({
            alert: ResponseStatus.ERROR,
            message: error.data.message,
          }):null
          break;
        default:
          setToast?setToast({
            alert: ResponseStatus.ERROR,
            message: error.data.message,
          }):null
          break;
      }
    }
  };

  return handleError;
};

export default useErrorHandler;
