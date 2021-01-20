import React, { useState, useRef, useContext } from 'react';
import AboutDialog from '../../AboutDialog/AboutDialog';
import Button from '@material-ui/core/Button';
import DeviceSelectionDialog from '../../DeviceSelectionDialog/DeviceSelectionDialog';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuContainer from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import { Theme, useMediaQuery } from '@material-ui/core';
import { GlobalStateContext } from '../../../state/GlobalState';

export default function Menu(props: { buttonClassName?: string }) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { setView } = useContext(GlobalStateContext);

  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button onClick={() => setMenuOpen(isOpen => !isOpen)} ref={anchorRef} className={props.buttonClassName}>
        {isMobile ? (
          <MoreIcon />
        ) : (
          <>
            Settings
            <ExpandMoreIcon />
          </>
        )}
      </Button>
      <MenuContainer
        open={menuOpen}
        onClose={() => setMenuOpen(isOpen => !isOpen)}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: isMobile ? -55 : 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={() => setAboutOpen(true)}>
          <Typography variant="body1">About</Typography>
        </MenuItem>
        <MenuItem onClick={() => setSettingsOpen(true)}>
          <Typography variant="body1">Audio and Video Settings</Typography>
        </MenuItem>
        <MenuItem onClick={() => setView('fullscreen')}>
          <Typography variant="body1">View Full Screen</Typography>
        </MenuItem>
        <MenuItem onClick={() => setView('expanded')}>
          <Typography variant="body1">View Expanded</Typography>
        </MenuItem>
        <MenuItem onClick={() => setView('minimal')}>
          <Typography variant="body1">View Minimal</Typography>
        </MenuItem>
      </MenuContainer>
      <AboutDialog
        open={aboutOpen}
        onClose={() => {
          setAboutOpen(false);
          setMenuOpen(false);
        }}
      />
      <DeviceSelectionDialog
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
    </>
  );
}
