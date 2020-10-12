import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dotRed: {
      height: '8px',
      width: '8px',
      backgroundColor: 'red',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '6px',
    },
    dotClear: {
      height: '8px',
      width: '8px',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '6px',
    },
    timer: {
      fontSize: '.6rem',
      color: 'white',
      borderRadius: '20px',
      marginLeft: 16,
      marginTop: 5,
      //   backgroundColor: "white"
    },
  })
);

const Timer = ({ style }: any) => {
  const styles = useStyles();

  const [time, setTime] = useState(0);

  const timer = setTimeout(function() {
    setTime(time - 1);
  }, 2000);

  const transformTime = (time: any) => new Date(time * 1000).toISOString().substr(14, 5);

  return (
    <span style={style} className={styles.timer}>
      <span className={time % 2 ? styles.dotClear : styles.dotRed} />
      recording
    </span>
  );
};

export default Timer;
