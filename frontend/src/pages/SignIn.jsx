import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ForgotPassword from '../components/component_ForgottenPassword/ForgotPassword';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import { apiGet } from '../components/API';

// function Copyright(props) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

const theme = createTheme();

export default function SignInSide() {
  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log({
    //   username: data.get('username'),
    //   password: data.get('password'),
    // });
    apiGet('user/login', {
      username: data.get('username'),
      password: data.get('password'),
    })
      .then((body) => {
        // console.log(body);
        sessionStorage.setItem('token', body.errormessage.token);
        sessionStorage.setItem('id', body.errormessage.id);
        sessionStorage.setItem('type', body.errormessage.type);
        sessionStorage.getItem('type') === '0' ? navigate('/home') : navigate('/dashboard');
      })
      .catch((e) => alert(e));
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <AppBar position="absolute" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              I-Student
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            // backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundImage:
              'url(https://images.unsplash.com/photo-1658093180204-fd48aa384ebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODkyMjY0OA&ixlib=rb-1.2.1&q=80&w=1080)',

            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
            backgroundSize: 'cover',
            backgroundPosition: 'contain',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, mt: 5, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {/* <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" /> */}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  {/* <Link href="#" variant="body2">
                    Forgot password?
                  </Link> */}
                  <ForgotPassword />
                </Grid>
                <Grid item>
                  <Link onClick={signUp} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              {/* <Copyright sx={{ mt: 5 }} /> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
