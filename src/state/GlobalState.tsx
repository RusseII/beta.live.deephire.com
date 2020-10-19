import React, { createContext, useState } from 'react';

interface GlobalStateContextType {
  role: 'candidate' | 'recruiter' | 'client';
  setRole: React.Dispatch<React.SetStateAction<GlobalStateContextType['role']>>;
  startingRole: 'candidate' | 'recruiter' | 'client';
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  feedbackScreen: boolean;
  setFeedbackScreen: React.Dispatch<React.SetStateAction<boolean>>;
  connectedName: string;
  setConnectedName: React.Dispatch<React.SetStateAction<string>>;
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
  const [baseRole] = useState<GlobalStateContextType['role']>(startingRole);
  const [notes, setNotes] = useState<string>('');
  const [feedbackScreen, setFeedbackScreen] = useState<boolean>(false);
  const [connectedName, setConnectedName] = useState<string>('');

  return (
    <GlobalStateContext.Provider
      value={{
        role,
        setRole,
        startingRole: baseRole,
        notes,
        setNotes,
        feedbackScreen,
        setFeedbackScreen,
        connectedName,
        setConnectedName,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
