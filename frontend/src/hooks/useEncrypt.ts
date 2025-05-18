import { useContext } from 'react';
import { EncryptContext } from '../context/EncryptContext';

const useEncrypt = () => {
  const context = useContext(EncryptContext);

  if (!context) {
    throw new Error('useEncrypt must be used within a EncryptProvider');
  }

  return context;
};

export default useEncrypt;
