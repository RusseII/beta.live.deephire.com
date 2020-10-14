import React, { createContext, useState } from 'react';

interface GlobalStateContextType {
  role: 'candidate' | 'recruiter' | 'client' | null;
  setRole: React.Dispatch<React.SetStateAction<GlobalStateContextType['role']>>;
}

export const GlobalStateContext = createContext<GlobalStateContextType>(null!);

const GlobalStateProvider = ({ children }: any) => {
  const [role, setRole] = useState<GlobalStateContextType['role']>(null);

  return <GlobalStateContext.Provider value={{ role, setRole }}>{children}</GlobalStateContext.Provider>;
};

export default GlobalStateProvider;
