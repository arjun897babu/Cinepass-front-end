import React, { memo, useEffect, useState } from 'react';
import { ResponseStatus, Role } from '../interface/Interface';

import UseAction from '../hooks/UseAction';

interface ToastProp {
  message: string;
  status: ResponseStatus;
  role: Role
}

const Toast: React.FC<ToastProp> = ({ message, status, role }) => {
  const [toastVisible, setToastVisible] = useState(true);
  const { clearError } = UseAction(role);
  useEffect(() => {
    const timer = setTimeout(() => {
      setToastVisible(false);
      clearError()
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [])

  return (
    <div>
      {toastVisible && (
        <div role="alert" className={`rounded font-serif  border-s-4 ${status === ResponseStatus.ERROR ? " border-red-500 bg-red-50" : "border-green-500 bg-green-50"} p-2 fixed top-4 right-4 z-40`}>

          <p className={` text-sm ${status === ResponseStatus.ERROR ? "text-red-700" : "text-green-700"}`}>
            {message ? message : 'Something went wrong'}
          </p>
        </div>
      )}
    </div>
  );
};

export default memo((Toast));
