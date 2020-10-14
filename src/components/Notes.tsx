import React, { useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLive } from '../hooks/useLive';
import { GlobalStateContext } from '../state/GlobalState';

import { styled, Theme } from '@material-ui/core/styles';

const Quill = styled(ReactQuill)(({ theme }: { theme: Theme }) => ({
  height: '100%',
  width: '100%',
  backgroundColor: 'white',
  gridArea: '3 / 1 / 4 / 3',
}));

const Notes = () => {
  const { data } = useLive();
  const { role } = useContext(GlobalStateContext);

  const startingCandidateNotes = data.interviewType === 'client' ? data.recruiterTemplate : undefined;

  if (role === 'client') {
    return <Quill defaultValue={data.clientTemplate} placeholder="Notes for the interview" />;
  }

  if (role === 'recruiter') {
    return <Quill defaultValue={data.recruiterTemplate} placeholder="Notes for the interview" />;
  }

  if (role === 'candidate') {
    return <Quill defaultValue={startingCandidateNotes} placeholder="Notes for the interview" />;
  }
  return null;
};

export default Notes;
