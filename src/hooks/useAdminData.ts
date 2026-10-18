import { useState, useEffect } from 'react';
import { getAdminData, AdminStoreData, EVENT_NAME } from '../services/adminStorage';

export function useAdminData(): AdminStoreData {
  const [data, setData] = useState<AdminStoreData>(getAdminData);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AdminStoreData>;
      if (customEvent.detail) {
        setData(customEvent.detail);
      } else {
        setData(getAdminData());
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return data;
}
