import React, { useEffect } from 'react';
import { ResponseStatus, Role } from '../interface/Interface';
import {   userClearError } from '../redux/reducers/userReducer'
import {   theaterClearError } from '../redux/reducers/theatersReducer'
import {   adminClearError } from '../redux/reducers/adminReducer'

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store';

interface ToastProp {
  message: string;
  status: ResponseStatus;
  role: Role
}

const Toast: React.FC<ToastProp> = ({ message, status, role }) => {
  const dispatch = useDispatch<AppDispatch>();
  let clearErrorAction

  if (Role.admin === role) {
    clearErrorAction = adminClearError
  } else if (Role.theaters === role) {
    clearErrorAction = theaterClearError
  } else {
    clearErrorAction = userClearError
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(clearErrorAction())
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [])

  return (
    <div>

      <div role="alert" className={`rounded font-serif  border-s-4 ${status === ResponseStatus.ERROR ? " border-red-500 bg-red-50" : "border-green-500 bg-green-50"} p-2 fixed top-4 right-4 z-40`}>

        <p className={` text-sm ${status === ResponseStatus.ERROR ? "text-red-700" : "text-green-700"}`}>
          {message ? message : 'Something went wrong'}
        </p>
      </div>

    </div>
  );
};

export default Toast;
