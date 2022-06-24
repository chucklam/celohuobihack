import { Box } from '@mui/material';

import Frame from '../Frame';

export default function About() {
  return (
    <Frame>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2>About</h2>
        <p>
          We make banking easy for Filipinos.
        </p>
      </Box>
      {/* <nav>
        <Link to="/">Go back to Signup</Link>
      </nav> */}
    </Frame>
  );
}
