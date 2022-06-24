import { Link as RouterLink } from 'react-router-dom';

import { Container, Link, Typography, TypographyProps  } from '@mui/material';

const Copyright = (props: TypographyProps) => (
  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }} {...props}>
    {'Copyright © '}
    <Link component={RouterLink} color="inherit" to="/about">
      CELO.PH
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
);

export default function Frame({ children }: { children: React.ReactNode }) {
  return (
    <Container component="main" maxWidth="xs">
      {children}
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
