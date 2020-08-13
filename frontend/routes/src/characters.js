import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './title';

const useStyles = makeStyles({
  charactersContext: {
    flex: 1,
  },
});

export default function Characters() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Character</Title>
      <Typography component="p" variant="h4">
        ...
      </Typography>
    </React.Fragment>
  );
}
