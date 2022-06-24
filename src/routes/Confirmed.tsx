import { Box } from '@mui/material';

import Frame from '../Frame';

export default function Confirmed() {
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
        <h2>Success!</h2>
        <p>
          We've texted you a special phone number for cashing in/out. Sending cUSD
          to this number via Valora will be automatically converted to PHP in your GCash wallet.
          Conversely, sending PHP to this number via GCash will convert to cUSD in Valora.
        </p>
      </Box>
      {/* <nav>
        <Link to="/">Go back to Signup</Link>
      </nav> */}
    </Frame>
  );
}
