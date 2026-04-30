"use client";
import React from "react";
import Link from "next/link";
import { FaShieldAlt, FaFire, FaLock } from 'react-icons/fa';
import { Box, Container, Typography, Button, Paper } from "@mui/material";

const Home: React.FC = () => {
  return (
    <Box sx={{ flex: 1, bgcolor: 'black' }}>
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: { xs: 2, sm: 4 }, // p-8
          color: 'text.secondary', // text-slate-200
        }}
      >
        {/* Hero Section */}
        <Box
          component="section"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '48rem', // max-w-3xl
            mb: 8, // mb-16
            mt: 6, // mt-12
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '3.75rem' }, // text-5xl md:text-6xl
              fontWeight: 800, // font-extrabold
              color: 'common.white',
              letterSpacing: '-0.025em', // tracking-tight
              mb: 3, // mb-6
            }}
          >
            Share sensitive data. <br />
            <Box component="span" sx={{ color: 'primary.light' }}> {/* text-emerald-500 */}
              Leave zero trace.
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.125rem', md: '1.25rem' }, // text-lg md:text-xl
              color: 'text.secondary', // text-slate-400
              mb: 5, // mb-10
              maxWidth: '42rem', // max-w-2xl
            }}
          >
            The secure, burn-after-reading file transfer utility built for developers. 
            Share API keys, environment variables, and sensitive documents that self-destruct the moment they are viewed.
          </Typography>

          {/* Primary Call to Action (Routes to the Upload Tool) */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%', justifyContent: 'center' }}>
            <Button
              component={Link}
              href="/upload"
              variant="contained"
              color="primary"
              sx={{
                px: 4, // px-8
                py: 2, // py-4
                fontSize: '1.125rem', // text-lg
                boxShadow: '0 10px 15px -3px rgb(4 120 87 / 0.5), 0 4px 6px -4px rgb(4 120 87 / 0.5)', // shadow-lg shadow-emerald-900/50
                '&:hover': {
                  backgroundColor: 'primary.light', // hover:bg-emerald-500
                },
              }}
            >
              Go to Upload Tool
            </Button>
            <Button
              component={Link}
              href="/about"
              variant="contained"
              sx={{
                px: 4, // px-8
                py: 2, // py-4
                fontSize: '1.125rem', // text-lg
                bgcolor: 'background.paper', // bg-slate-800
                color: 'text.primary', // text-slate-300
                '&:hover': {
                  bgcolor: '#374151', // hover:bg-slate-700 (gray-700)
                  color: 'common.white', // hover:text-white
                },
              }}
            >
              How it Works
            </Button>
          </Box>
        </Box>

        {/* Feature Highlights (3-Column Grid) */}
        <Box
          component="section"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4, // gap-8 -> theme.spacing(4) is 32px
            maxWidth: '64rem', // max-w-5xl
            width: '100%',
            mt: 4, // mt-8
            borderTop: 1,
            borderColor: 'background.paper', // border-slate-800
            pt: 8, // pt-16
          }}
        >
          <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3, bgcolor: 'background.default', borderRadius: '12px', border: 1, borderColor: 'background.paper' }}>
            <FaShieldAlt style={{ fontSize: '2.25rem', color: '#10b981', marginBottom: '1rem' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'common.white', mb: 1 }}>
              End-to-End Secure
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Files are converted to BinData and encrypted in transit to ensure total privacy.
            </Typography>
          </Paper>

          <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3, bgcolor: 'background.default', borderRadius: '12px', border: 1, borderColor: 'background.paper' }}>
            <FaFire style={{ fontSize: '2.25rem', color: '#f97316', marginBottom: '1rem' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'common.white', mb: 1 }}>
              Burn After Reading
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Links are strictly one-time-use. The database record is permanently wiped the second it is opened.
            </Typography>
          </Paper>

          <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3, bgcolor: 'background.default', borderRadius: '12px', border: 1, borderColor: 'background.paper' }}>
            <FaLock style={{ fontSize: '2.25rem', color: '#0ea5e9', marginBottom: '1rem' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'common.white', mb: 1 }}>
              Persistent Vault
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Authenticated users gain access to a private dashboard to manage active links, track expirations, and store files permanently until explicitly deleted.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;