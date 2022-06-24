import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Frame from '../Frame';

type OTPSubmission = (name: string) => void;

const OTPInput: FC<{ onSubmit: OTPSubmission }> = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: { otp: '' },
    validationSchema: yup.object({
      otp: yup.string()
        .required('One-time passcode is required.')
        .matches(/^\d*$/, 'One-time passcode must be only digits.')
        .length(6, 'One-time passcode must be exactly 6 digits.')
    }),
    onSubmit: (values) => onSubmit(values.otp),
  });

  return (
    <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
      <TextField
        // The telephone keypad looks better than the numeric keypad on iOS for OTP entry
        // https://mobiforge.com/design-development/html5-mobile-web-forms-and-input-types
        type="tel"
        autoComplete="one-time-code"

        autoFocus
        fullWidth
        inputProps={{ style: { textAlign: 'center' } }}
        placeholder="000000"

        value={formik.values.otp}
        onChange={(e) => {
          // Prohibit typing in of non-digit characters
          formik.setFieldValue('otp', e.target.value.replace(/[^0-9]/g, ''));
        }}

        error={formik.touched.otp && Boolean(formik.errors.otp)}
        helperText={formik.touched.otp && formik.errors.otp}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={formik.isSubmitting || formik.values.otp.length !== 6}
        sx={{ mt: 3, mb: 2 }}
      >
        {formik.isSubmitting ? <CircularProgress size={24} color="info" /> : 'Submit'}
      </Button>
    </form>
  );
};

export default function OTP() {
  let { phone } = useParams();
  const navigate = useNavigate();

  return (
    <Frame>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="subtitle1" gutterBottom>
          We sent a one-time passcode to {phone}. Enter it below:
        </Typography>
        <OTPInput onSubmit={async (otp: string) => {
          const response = await fetch(`${process.env.REACT_APP_API}accounts/${phone}`, {
            method: 'PUT',
            body: JSON.stringify({ otp }),
            headers: { 'Content-Type': 'application/json' }
          }).then(response => response.json());
          console.log(response);

          navigate('/confirmed');
        }} />
      </Box>
    </Frame>
  );
}
