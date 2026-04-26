"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaFolderOpen, FaTrashAlt, FaExternalLinkAlt, FaFileAlt, FaLock } from "react-icons/fa";
import { Box, Container, Typography, Button, Paper, CircularProgress, Link as MuiLink } from "@mui/material";
import { LuVault } from "react-icons/lu";
import { useSession } from "next-auth/react";

const Vault: React.FC = () => {
  const { data: session, status } = useSession(); // GRAB SESSION STATUS
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Stop immediately if they aren't logged in
    if (status !== "authenticated") {
        setLoading(false);
        return;
    }

    const fetchVault = async () => {
      try {
        const res = await fetch('/api/vault');
        const data = await res.json();
        if (data.success) {
          setFiles(data.files);
        }
      } catch (err) {
        console.error("Failed to load vault:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVault();
  }, [status]); // Re-run if login status changes

  const handleDelete = async (fileId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this file?")) return;

    try {
      const res = await fetch(`/api/vault?id=${fileId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setFiles(files.filter(file => file._id !== fileId));
      } else {
        alert("Failed to delete the file.");
      }
    } catch (err) {
      console.error("Delete request failed:", err);
    }
  };

  // --- UI STATE 1: LOGGED OUT (ACCESS DENIED) ---
  if (status === "unauthenticated") {
    return (
      <Box sx={{ flex: 1, bgcolor: 'black', display: 'flex', flexDirection: 'column' }}>
        <Container
          component="main"
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            p: 4,
            pt: 12,
            color: 'text.secondary'
          }}
        >
          <FaLock style={{ fontSize: '3.75rem', color: '#10b981', marginBottom: '1.5rem' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'common.white', mb: 2 }}>
            Access Denied
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 4 }}>
            You must be logged in to view your Personal Vault.
          </Typography>
          <Button component={Link} href="/login" variant="contained" color="primary">
            Log In to Continue
          </Button>
        </Container>
      </Box>
    );
  }

  // --- UI STATE 2: LOADING ---
  if (loading || status === "loading") {
    return (
      <Box sx={{ flex: 1, bgcolor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress color="primary" size={20} />
          <Typography>Accessing Vault Chunks...</Typography>
        </Box>
      </Box>
    );
  }

  // --- UI STATE 3: LOGGED IN (SHOW VAULT) ---
  return (
    <Box sx={{ flex: 1, bgcolor: 'black' }}>
      <Container component="main" maxWidth="lg" sx={{ p: { xs: 2, sm: 4 }, pt: 6, color: 'text.secondary' }}>

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LuVault style={{ fontSize: '2.25rem', color: '#10b981' }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'common.white' }}>My Vault</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Manage your active links and encrypted files.</Typography>
            </Box>
          </Box>
          <Button component={Link} href="/upload" variant="contained" color="primary">
            + New Upload
          </Button>
        </Box>

        {files.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 10,
              px: 2,
              bgcolor: 'rgba(15, 23, 42, 0.5)', // slate-900/50
              borderStyle: 'dashed',
              borderColor: 'background.paper', // slate-800
              borderRadius: '1rem',
              textAlign: 'center'
            }}
          >
            <FaFolderOpen style={{ fontSize: '3.75rem', color: '#1e293b', marginBottom: '1rem' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>Your vault is empty</Typography>
            <Typography sx={{ color: 'text.disabled', maxWidth: '42rem', mb: 3, fontSize: '0.875rem' }}>
              You haven't uploaded any permanent files yet.
            </Typography>
            <Button component={Link} href="/upload" variant="contained" sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: '#334155' } }}>
              Go to Drop Zone
            </Button>
          </Paper>
        ) : (
          <Box sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2
          }}>
            {files.map((file) => (
              <Paper
                key={file._id}
                elevation={0}
                sx={{
                  bgcolor: 'background.default',
                  border: 1,
                  borderColor: 'background.paper',
                  p: 2.5,
                  borderRadius: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.3s',
                  '&:hover': { borderColor: '#334155' }
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <FaFileAlt style={{ color: 'rgba(16, 185, 129, 0.5)', fontSize: '1.25rem' }} />
                    <Typography sx={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'text.primary' }} title={file.filename}>
                      {file.filename}
                    </Typography>
                  </Box>
                  <Box sx={{ fontSize: '0.75rem', color: 'text.disabled', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption">Size: {(file.length / (1024 * 1024)).toFixed(2)} MB</Typography>
                    <Typography variant="caption">Stored: {new Date(file.uploadDate).toLocaleDateString()}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={MuiLink}
                    href={`/download/${file.metadata.token}`}
                    target="_blank"
                    variant="contained"
                    startIcon={<FaExternalLinkAlt size={10} />}
                    sx={{ flex: 1, py: 1, bgcolor: 'background.paper', '&:hover': { bgcolor: '#334155' }, fontSize: '0.75rem' }}
                  >
                    Download
                  </Button>
                  <Button
                    onClick={() => handleDelete(file._id)}
                    sx={{
                      minWidth: 'auto',
                      px: 1.5,
                      bgcolor: 'rgba(127, 29, 29, 0.2)',
                      color: '#ef4444',
                      border: 1,
                      borderColor: 'rgba(127, 29, 29, 0.3)',
                      '&:hover': { bgcolor: 'rgba(127, 29, 29, 0.4)' }
                    }}
                  >
                    <FaTrashAlt size={12} />
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Vault;