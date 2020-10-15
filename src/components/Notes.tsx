import React, { useContext, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLive } from '../hooks/useLive';
import { GlobalStateContext } from '../state/GlobalState';

import { styled, Theme } from '@material-ui/core/styles';

const Quill = styled(ReactQuill)(({ theme }: { theme: Theme }) => ({
  height: '100%',
  width: '100%',
  backgroundColor: 'white',
  gridArea: '3 / 2 / 4 / 4',
}));

const Notes = () => {
  const [notes, setNotes] = useState('');
  const { data } = useLive();
  const { role } = useContext(GlobalStateContext);
  const isSendOut = data.interviewType === 'client';
  const startingCandidateNotes = isSendOut ? data.recruiterTemplate : undefined;

  if (role === 'client') {
    return (
      <Quill
        onChange={setNotes}
        key="client"
        defaultValue={data.clientTemplate}
        placeholder="Notes for the interview1"
      />
    );
  }

  if (role === 'recruiter') {
    return (
      <Quill
        onChange={setNotes}
        key="recruiter"
        readOnly={isSendOut}
        defaultValue={data.recruiterTemplate}
        placeholder="Notes for the interview2"
      />
    );
  }

  if (role === 'candidate') {
    return (
      <Quill
        onChange={setNotes}
        key="candidate"
        defaultValue={startingCandidateNotes}
        placeholder="Notes for the interview3"
      />
    );
  }
  return null;
};

export default Notes;
