import React, { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLive, useParticipant } from '../hooks/useLive';
import useVideoContext from '../hooks/useVideoContext/useVideoContext';

import { GlobalStateContext } from '../state/GlobalState';

import { styled, Theme } from '@material-ui/core/styles';
import { Select } from 'antd';

const Area = styled('div')(({ theme }: { theme: Theme }) => ({
  backgroundColor: 'white',
  height: '100%',
  width: '100%',
  // gridArea: '3 / 2 / 4 / 4',
}));
const Quill = styled(ReactQuill)(({ theme }: { theme: Theme }) => ({
  backgroundColor: 'white',
  width: '100%',
  height: '100%',
}));

const Notes = () => {
  const {
    room: { localParticipant },
  } = useVideoContext();

  const { data } = useLive();
  const startingNotes = data?.participants?.[localParticipant.identity]?.notes;

  const { role, notes, setNotes } = useContext(GlobalStateContext);
  const isSendOut = data.interviewType === 'client';

  useEffect(() => {
    console.log('ran effect');
    if (!notes && startingNotes) {
      setNotes(startingNotes);
    }
  }, [notes, setNotes, startingNotes]);
  // const startingCandidateNotes = isSendOut ? data.recruiterTemplate : undefined;

  const prepRoomRecruiter = role === 'recruiter' && data.interviewType === 'client';

  useParticipant(notes);
  const activeCandidates = Object.keys(data?.participants || {})
    .map(key => ({ name: key, ...data.participants[key] }))
    .filter(participant => participant.role === 'candidate');

  const [selectedCandidate, setSelectedCandidate] = useState<string>(activeCandidates?.[0]?.name);
  const selectedCandidateNotes = data?.participants?.[selectedCandidate]?.notes || '';

  if (role === 'client') {
    return (
      <Area>
        <Quill
          onChange={setNotes}
          key="client"
          defaultValue={startingNotes || data.clientTemplate}
          placeholder="Notes for the interview1"
        />
      </Area>
    );
  }
  if (prepRoomRecruiter) {
    return (
      <Area>
        <div style={{ padding: 8 }}>
          Select a candidate to view their notes:
          <SelectCandidate
            selectedCandidate={selectedCandidate}
            activeCandidates={activeCandidates}
            setSelectedCandidate={setSelectedCandidate}
          />
        </div>
        <Quill
          modules={{ toolbar: false }}
          key="prepRoomRecruiter"
          readOnly
          value={activeCandidates ? selectedCandidateNotes : data.recruiterTemplate}
          placeholder={'Notes will show up here when the candidete joins the room and starts typing'}
        />
      </Area>
    );
  }
  if (role === 'recruiter') {
    return (
      <Quill
        onChange={setNotes}
        key="recruiter"
        readOnly={isSendOut}
        defaultValue={startingNotes || data.recruiterTemplate}
        placeholder={isSendOut ? 'This field is only editable by the candidate' : 'Notes for the interview2'}
      />
    );
  }

  if (role === 'candidate') {
    return (
      // <Area>
      <Quill
        onChange={setNotes}
        key="candidate"
        defaultValue={startingNotes || data.candidateTemplate}
        placeholder="Notes for the interview"
      />
      // </Area>
    );
  }
  return null;
};

const SelectCandidate = ({ activeCandidates, setSelectedCandidate, selectedCandidate }: any) => (
  <Select
    placeholder="Select a candidate"
    defaultValue={selectedCandidate}
    style={{ width: 120, marginLeft: 8 }}
    onChange={value => setSelectedCandidate(value)}
  >
    {activeCandidates.map((candidate: any) => (
      <Select.Option value={candidate.name}>{candidate.name}</Select.Option>
    ))}
  </Select>
);
export default Notes;
