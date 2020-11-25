import React, { useContext, useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLive, useParticipant } from '../hooks/useLive';
import useVideoContext from '../hooks/useVideoContext/useVideoContext';
import { Button } from 'antd';
import { GlobalStateContext } from '../state/GlobalState';

import { styled, makeStyles, Theme } from '@material-ui/core/styles';
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

const useStyles = makeStyles((theme: Theme) => ({
  quill: {
    height: 'calc(100% - 42px)',
    width: 'calc(100% - 165px)',
  },
}));

const Notes = () => {
  const classes = useStyles();

  let quilRef: any = useRef(null);
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

  useEffect(() => {
    const attachQuillRefs = () => {
      if (typeof quilRef?.current?.getEditor !== 'function') return;
      quilRef.current = quilRef.current.getEditor();
    };
    attachQuillRefs();
  }, [quilRef]);

  // const startingCandidateNotes = isSendOut ? data.recruiterTemplate : undefined;

  const prepRoomRecruiter = role === 'recruiter' && data.interviewType === 'client';

  useParticipant(notes);
  const activeCandidates = Object.keys(data?.participants || {})
    .map(key => ({ name: key, ...data.participants[key] }))
    .filter(participant => participant.role === 'candidate');

  const [selectedCandidate, setSelectedCandidate] = useState<string>(activeCandidates?.[0]?.name);
  const selectedCandidateNotes = data?.participants?.[selectedCandidate]?.notes || '';

  function scrollToSection(content = 'Job Search Activities') {
    const quillText = quilRef.current.getText();
    let contentIndex = quillText.lastIndexOf(content);

    //scroll to bottom, then where you want. This ensures that the text is
    // at the top of the final scroll locaiton
    if (contentIndex !== -1) {
      quilRef.current.setSelection(quillText.length - 1, 1);
      quilRef.current.setSelection(contentIndex, content.length);
    }
  }

  const AppleOneTemplate = () => (
    <>
      <div style={{ width: 165, marginTop: 12 }}>
        <div>
          <Button size="small" type="link" onClick={() => scrollToSection('Qualify availability factors')}>
            Availability Factors
          </Button>
        </div>
        <div>
          <Button size="small" type="link" onClick={() => scrollToSection('Open Seed Interview')}>
            Open Seed Interview
          </Button>
        </div>
        <div>
          <Button size="small" type="link" onClick={() => scrollToSection('Previous Employers')}>
            Previous Employers
          </Button>
        </div>
        <div>
          <Button size="small" type="link" onClick={() => scrollToSection('Where Temped')}>
            Where Temped
          </Button>
        </div>
        <div>
          <Button size="small" type="link" onClick={() => scrollToSection('Peer & Co-Worker References')}>
            References{' '}
          </Button>
        </div>
        <div>
          <Button size="small" type="link" onClick={() => scrollToSection('Priorities')}>
            Priorities
          </Button>
        </div>
        <div>
          <Button size="small" type="link" onClick={() => scrollToSection('Job Search Activities')}>
            Job Search Activities{' '}
          </Button>
        </div>
        <div>
          <Button
            size="small"
            type="link"
            onClick={() => scrollToSection('Where Want to Work, Competitors/Cust’s/Vendors')}
          >
            Target Companies{' '}
          </Button>
        </div>
        <div>
          <Button size="small" type="link" onClick={() => scrollToSection('Hot Selling Points')}>
            Hot Selling Points{' '}
          </Button>
        </div>
        <div>
          <Button size="small" type="link" onClick={() => scrollToSection('Close and Referrals')}>
            Close/Referrals{' '}
          </Button>
        </div>
        <div>
          <Button size="small" type="link" onClick={() => scrollToSection('Disengagement Script')}>
            Disengagement Script
          </Button>
        </div>
      </div>
      <div></div>
    </>
  );

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
      <Area>
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
          <AppleOneTemplate />
          <ReactQuill
            className={classes.quill}
            ref={quilRef}
            onChange={setNotes}
            key="recruiter"
            readOnly={isSendOut}
            defaultValue={startingNotes || data.recruiterTemplate}
            placeholder={isSendOut ? 'This field is only editable by the candidate' : 'Notes for the interview'}
          />
        </div>
        {/* </div> */}
      </Area>
    );
  }

  if (role === 'candidate') {
    return (
      <Quill
        onChange={setNotes}
        key="candidate"
        defaultValue={startingNotes || data.candidateTemplate}
        placeholder="Notes for the interview"
      />
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
