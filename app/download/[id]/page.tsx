"use client";
import React, { use, useEffect, useState } from "react";
import { FaDownload, FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";
import { Box, Container, Typography, Button, Paper } from "@mui/material";

const Download: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = use(params);
  const fileId = resolvedParams.id;

  const [fileData, setFileData] = useState<any>(null);
  // We start with NO warning state at all. 
  const [warningElement, setWarningElement] = useState<React.ReactNode>(null);

  useEffect(() => {
    fetch(`/api/download?token=${fileId}&metadataOnly=true`)
      .then(res => res.json())
      .then(data => {
        if (data.file) {
          setFileData(data.file);
          
          // ONLY if the database explicitly says it's a burn file, 
          // do we generate the warning UI and put it in state.
          if (data.file.metadata?.burnAfterReading === true) {
            setWarningElement(
              <Box sx={{
                color: '#fb923c', // orange-400
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mt: 1
              }}>
                <FaExclamationTriangle /> This file will self-destruct after downloading.
              </Box>
            );
          }
        }
      })
      .catch(err => console.error("Error checking file:", err));
  }, [fileId]);

  return (
    <Box sx={{ flex: 1, bgcolor: 'black', color: 'text.secondary' }}>
      <Container
        component="main"
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: { xs: 2, sm: 4 }
        }}
      >
        <Paper
          elevation={24}
          sx={{
            width: '100%',
            bgcolor: 'background.default', // bg-slate-900
            border: 1,
            borderColor: 'background.paper', // border-slate-800
            p: 4, // p-8
            borderRadius: '1rem', // rounded-2xl
            textAlign: 'center'
          }}
        >
          <FaShieldAlt style={{ fontSize: '3rem', color: '#10b981', margin: 'auto', marginBottom: '1rem' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'common.white', mb: 1 }}>
            Secure File Transfer
          </Typography>
          
          <Box sx={{ color: 'text.secondary', mb: 4, minHeight: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography>You have been sent a secure, encrypted file.</Typography>
            
            {/* This variable is NULL when the page loads. 
               The browser renders absolutely nothing here.
               It only changes if the 'setWarningElement' above is called.
            */}
            {warningElement}
          </Box>

          <Box sx={{
            bgcolor: '#020617', // bg-slate-950
            border: 1,
            borderColor: 'background.paper', // border-slate-800
            borderRadius: '0.5rem', // rounded-lg
            p: 2, // p-4
            mb: 4, // mb-8
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'left'
          }}>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 500 }}>
                Ready to download
              </Typography>
              <Typography sx={{ color: 'text.primary', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                encrypted_payload_{fileId.substring(0,6)}.bin
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary', ml: 2, flexShrink: 0 }}>
              {fileData?.length ? (fileData.length / 1024 / 1024).toFixed(1) : "..."} MB
            </Typography>
          </Box>

          <Button 
            onClick={() => window.location.href = `/api/download?token=${fileId}`}
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<FaDownload />}
            sx={{
              py: 1.5, // py-4
              fontSize: '1.125rem', // text-lg
              boxShadow: '0 10px 15px -3px rgb(4 120 87 / 0.2), 0 4px 6px -4px rgb(4 120 87 / 0.2)', // shadow-lg shadow-emerald-900/20
              '&:hover': {
                backgroundColor: 'primary.light' // hover:bg-emerald-500
              }
            }}
          >
            Download & Decrypt File
          </Button>
        </Paper>

      </Container>
    </Box>
  );
};

export default Download;