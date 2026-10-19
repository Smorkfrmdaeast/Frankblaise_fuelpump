import { useState, useEffect } from 'react';
import { AuthoritativeProductConfig } from '../types/product';
import { getAuthoritativeProductConfig } from '../services/firebase';

export function useProductConfig(): AuthoritativeProductConfig {
  const [config, setConfig] = useState<AuthoritativeProductConfig>(() =>
    getAuthoritativeProductConfig()
  );

  useEffect(() => {
    const handleUpdate = (e: CustomEvent<AuthoritativeProductConfig>) => {
      if (e.detail) {
        setConfig(e.detail);
      } else {
        setConfig(getAuthoritativeProductConfig());
      }
    };

    window.addEventListener(
      'frankblaise_config_updated' as any,
      handleUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        'frankblaise_config_updated' as any,
        handleUpdate as EventListener
      );
    };
  }, []);

  return config;
}
