import React, { createContext, useState } from 'react';

interface GlobalStateContextType {
  role: 'candidate' | 'recruiter' | 'client';
  setRole: React.Dispatch<React.SetStateAction<GlobalStateContextType['role']>>;
}

export const GlobalStateContext = createContext<GlobalStateContextType>(null!);

const GlobalStateProvider = ({ children }: any) => {
  const { search } = window.location;
  const startingRole = search.includes('role=recruiter')
    ? 'recruiter'
    : search.includes('role=client')
    ? 'client'
    : 'candidate';

  const [role, setRole] = useState<GlobalStateContextType['role']>(startingRole);

  return <GlobalStateContext.Provider value={{ role, setRole }}>{children}</GlobalStateContext.Provider>;
};

export default GlobalStateProvider;
