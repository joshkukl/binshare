"use client";
import React, { useState } from "react"; // 1. Added useState
import Link from "next/link";
import { useRouter } from "next/navigation"; // 2. Added Next.js router to redirect after success
import { FaArchive } from "react-icons/fa";
import { Box, Container, Paper, Typography, OutlinedInput, Button, Link as MuiLink, CircularProgress } from "@mui/material";

const Register: React.FC = () => {
  // 3. Set up state to hold the form data and errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  // 4. The actual function that talks to your new API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear any old errors

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send exactly what the schema expects
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success! Redirect the user to the login page
      router.push("/login");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ flex: 1, bgcolor: 'black' }}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: { xs: 2, sm: 4 },
        }}
      >
        <Paper
          elevation={24}
          sx={{
            width: '100%',
            bgcolor: 'background.default',
            border: 1,
            borderColor: 'background.paper',
            p: 4,
            borderRadius: '1rem',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <FaArchive className="text-4xl text-emerald-500 mb-4" />
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'common.white' }}>
              Create an account
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Start sharing files securely today
            </Typography>
          </Box>

          {/* 5. Hook up the form to our new function */}
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={handleSubmit}>
            {/* Added a red error message box that only shows if something goes wrong */}
            {error && (
              <Paper
                variant="outlined"
                sx={{
                  borderColor: 'rgba(239, 68, 68, 0.5)',
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  p: 1.5,
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                }}
              >
                <Typography variant="body2">{error}</Typography>
              </Paper>
            )}

            <div>
              <Typography component="label" sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary', mb: 0.5 }}>
                Email Address
              </Typography>
              <OutlinedInput
                type="email"
                required
                fullWidth
                value={email} // Bind to state
                onChange={(e) => setEmail(e.target.value)} // Update state on type
                placeholder="you@example.com"
                sx={{
                  backgroundColor: '#020617',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'background.paper' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'background.paper' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                  '& .MuiInputBase-input': { color: 'text.primary', py: 1.5, px: 2 },
                }}
              />
            </div>
            <div>
              <Typography component="label" sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary', mb: 0.5 }}>
                Password
              </Typography>
              <OutlinedInput
                type="password"
                required
                fullWidth
                inputProps={{ minLength: 6 }}
                value={password} // Bind to state
                onChange={(e) => setPassword(e.target.value)} // Update state on type
                placeholder="Create a strong password"
                sx={{
                  backgroundColor: '#020617',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'background.paper' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'background.paper' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                  '& .MuiInputBase-input': { color: 'text.primary', py: 1.5, px: 2 },
                }}
              />
            </div>

            {/* Change button text when loading */}
            <Button
              type="submit"
              disabled={isLoading}
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                py: 1.5,
                mt: 2,
                boxShadow: '0 10px 15px -3px rgb(4 120 87 / 0.2), 0 4px 6px -4px rgb(4 120 87 / 0.2)',
                '&:hover': { backgroundColor: 'primary.light' },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ color: 'text.disabled', mt: 3 }}>
            Already have an account?{' '}
            <MuiLink component={Link} href="/login" sx={{ color: 'primary.light', '&:hover': { color: '#34d399' }, fontWeight: 500 }}>
              Sign in
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;