import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { Image } from 'mui-image';
import ReactFlagsSelect from 'react-flags-select';

import { AsYouTypeFormatter, PhoneNumberFormat as PNF, PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

// Format a (possibly incomplete) phone number
const formatPhoneNumber = (phone: string, country: string) => {

  // Remove non-numeric digits as they seem to confuse the formatter.
  let phoneNumber = phone.replace(/[^0-9]/g, '');

  const formatter = new AsYouTypeFormatter(country);
  formatter.clear();
  let formattedPhoneNumber = '';
  for (let digit of phoneNumber) {
    formattedPhoneNumber = formatter.inputDigit(digit);
  }

  return formattedPhoneNumber;
};

enum Form {
  PHONE = 'phone',
  FIRSTNAME = 'firstName',
  LASTNAME = 'lastName',
}

// To ease development outside of PH, add to local storage the key `country_options`
// with value `["US", "PH"]` to override the default country options.

  export default function SignUp() {
  const [countryOptions, setCountryOptions] = useState(['PH', 'US']);
  const [country, setCountry] = useState(countryOptions[0]);

  useEffect(() => {
    try {
      const item = localStorage.getItem('country_options');
      if (!item) return;

      const options = JSON.parse(item);

      if (!Array.isArray(options)) return;
      if (options.length < 1) return;

      setCountryOptions(options);
      setCountry(options[0]);
    } catch (e) { console.error(e) }
  }, []);

  const navigate = useNavigate();

  // Configure Formik to handle form submission
  const initialValues: { [key in Form]: string } = { phone: '', firstName: '', lastName: '' };
  const yupSchemaObject: { [key in Form]: yup.StringSchema } = {
    firstName: yup.string().required('First name is required'),
    lastName:  yup.string().required('Last name is required'),
    phone:     yup.string().required('Phone number is required')
      .test('valid phone number', 'Invalid phone number', value => {
        if (!value || value.length < 2) return false;

        const number = phoneUtil.parse(value, country);
        return phoneUtil.isValidNumber(number);
      }),
  };
  const formik = useFormik({
    initialValues,
    validationSchema: yup.object(yupSchemaObject),
    onSubmit: async (values) => {
      const phone = phoneUtil.parse(values.phone, country);
      const phoneE164 = phoneUtil.format(phone, PNF.E164);

      const response = await fetch(`${process.env.REACT_APP_API}signups`, {
        method: 'POST',
        body: JSON.stringify({ ...values, phone: phoneE164, country }),
        headers: { 'Content-Type': 'application/json' }
      }).then(response => response.json());
      console.log(response);

      navigate(`/account/${phoneE164}/otp`);
    },
  });

  return (
    <>
      <Image src="/brand_banner_celo_gcash.png" alt="brand logo" width="100%" style={{ minHeight: 125 }} />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1" gutterBottom component="div">
            Have a Valora wallet and a GCash wallet?
            Are they under the same phone number?
            <br /><br />
            If so, sign up to enable simple cashing in/out between them!
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
            {
              // Don't show the country selector if there's only one option
              (countryOptions.length > 1) && (
                <ReactFlagsSelect
                  selected={country}
                  onSelect={code => setCountry(code)}
                  countries={countryOptions}
                />
              )
            }
            <TextField
              label="Phone Number *"
              type="tel"
              autoComplete="tel-national"
              name={Form.PHONE}
              margin="normal"
              autoFocus
              fullWidth
              value={formik.values.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const formattedPhoneNumber = formatPhoneNumber(e.target.value, country);
                formik.setFieldValue(Form.PHONE, formattedPhoneNumber);
              }}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
            <TextField
              label="First Name *"
              type="text"
              autoComplete="given-name"
              name={Form.FIRSTNAME}
              margin="normal"
              fullWidth
              value={formik.values.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                formik.setFieldValue(Form.FIRSTNAME, e.target.value);
              }}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
            />
            <TextField
              label="Last Name *"
              type="text"
              autoComplete="family-name"
              name={Form.LASTNAME}
              margin="normal"
              fullWidth
              value={formik.values.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                formik.setFieldValue(Form.LASTNAME, e.target.value);
              }}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={formik.isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              {formik.isSubmitting ? <CircularProgress size={24} color="info" /> : 'Sign Up'}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}