"use client";
import React from "react";
import Image from "next/image";
import { Box, Container, Typography, Paper } from "@mui/material";
import { FaShieldAlt, FaUserSecret, FaFire } from "react-icons/fa";

const About: React.FC = () => {
  return (
    <Box sx={{ flex: 1, width: '100%', bgcolor: 'black', overflowY: 'auto' }}>
      <Container
        component="main"
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 6,
          px: 4,
          color: 'text.primary',
        }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
          About BinShare
        </Typography>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '32rem', // h-128
            mb: 5, // mb-10
            overflow: 'hidden',
            borderRadius: '0.75rem', // rounded-xl
            border: 1,
            borderColor: 'background.paper', // border-slate-800
            boxShadow: 24, // shadow-2xl
          }}
        >
          <Image
            src="/vaultimage_0.jpg"
            alt="BinShare Vault Concept"
            fill
            style={{ objectFit: 'cover' }}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 4, // space-y-8
            color: 'text.secondary', // text-slate-300
            lineHeight: 1.625, // leading-relaxed
          }}
        >
          <Box component="section">
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: 'common.white', mb: 1.5 }}>
              The Platform
            </Typography>
            <Typography>
              BinShare is a secure, automated file-sharing platform engineered to handle temporary data lifecycles with built-in garbage collection. Instead of relying on traditional file servers that leave vulnerable artifacts behind, uploads are converted directly into BSON BinData and stored securely within a temporary database cluster.
            </Typography>
          </Box>

          <Box
            component="section"
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3, // gap-6
              py: 3, // py-6
              borderTop: 1,
              borderBottom: 1,
              borderColor: 'background.paper', // border-slate-800
            }}
          >
            <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', bgcolor: 'transparent', p: 2 }}>
              <FaShieldAlt style={{ fontSize: '1.875rem', color: '#10b981', marginBottom: '0.75rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 500, color: 'common.white', mb: 0.5 }}>Zero Trust</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Files are encrypted before they ever leave your device.</Typography>
            </Paper>
            <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', bgcolor: 'transparent', p: 2 }}>
              <FaFire style={{ fontSize: '1.875rem', color: '#f97316', marginBottom: '0.75rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 500, color: 'common.white', mb: 0.5 }}>Burn After Reading</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Database records are permanently wiped the second a link is opened.</Typography>
            </Paper>
            <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', bgcolor: 'transparent', p: 2 }}>
              <FaUserSecret style={{ fontSize: '1.875rem', color: '#3b82f6', marginBottom: '0.75rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 500, color: 'common.white', mb: 0.5 }}>Total Privacy</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>No logs, no tracking, and absolute anonymity for your transfers.</Typography>
            </Paper>
          </Box>

          <Box component="section">
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: 'common.white', mb: 1.5 }}>
              Built for Security
            </Typography>
            <Typography>
              Designed for developers and security-conscious teams, the architecture focuses heavily on secure network protocols and robust system design. By implementing strict data handling and automatic deletion, the platform ensures your information remains completely locked down from end to end.
            </Typography>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default About;