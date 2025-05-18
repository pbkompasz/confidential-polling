import { useContext } from 'react';
import { AccountContext } from '@/context/AccountContext';

const useAccount = () => {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error('useAccount must be used within a EventProvider');
  }

  return context;
};

export default useAccount;
