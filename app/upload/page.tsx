"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { FaCloudUploadAlt, FaLock, FaFire, FaClock, FaCog, FaCopy, FaCheck } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Box, Container, Typography, Button, Paper, RadioGroup, FormControlLabel, Radio, Checkbox, Divider, Modal, Backdrop, Fade, OutlinedInput, CircularProgress, Link as MuiLink } from "@mui/material";
 
const Upload: React.FC = () => {
  const { data: session } = useSession(); // 2. Grab login status
  const [saveToVault, setSaveToVault] = useState(false); // 3. Track the user's choice
  const [burnAfterReading, setBurnAfterReading] = useState(false); // Add this

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null); 
  const [copied, setCopied] = useState(false);

  const processFile = async (file: File) => {
    setDownloadUrl(null); // ADD THIS: Clears any old link before starting
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("saveToVault", String(saveToVault)); // 4. Tell the backend the choice
    formData.append("burnAfterReading", String(burnAfterReading)); // Add this

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      
      const url = `${window.location.origin}/download/${data.data[0].token}`;
      setDownloadUrl(url);
    } catch (error) {
      console.error(error);
      alert("Error uploading file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <Box sx={{ flex: 1, bgcolor: 'black' }}>
      <Container component="main" maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: { xs: 2, sm: 4 } }}>

        <Box sx={{ width: '100%', textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>Secure Drop Zone</Typography>
          <Typography sx={{ color: 'text.secondary' }}>Files are encrypted locally before transmission.</Typography>
        </Box>

        {/* Drag & Drop Area */}
        <Box
          sx={{
            width: '100%',
            height: '16rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed',
            borderRadius: '0.75rem',
            transition: 'all 200ms',
            borderColor: isDragging ? 'primary.light' : '#334155', // slate-700
            bgcolor: isDragging ? 'rgba(16, 185, 129, 0.1)' : '#0f172a', // slate-900
            '&:hover': {
              borderColor: isDragging ? 'primary.light' : '#64748b', // slate-500
              bgcolor: isDragging ? 'rgba(16, 185, 129, 0.1)' : '#1e293b', // slate-800
            },
          }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <FaCloudUploadAlt style={{ fontSize: '3.75rem', marginBottom: '1rem', color: isDragging ? '#10b981' : '#64748b' }} />
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 500, mb: 0.5 }}>Drag and drop your files here</Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled', mb: 2 }}>or click to browse from your computer</Typography>

          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            variant="contained"
            sx={{
              bgcolor: '#334155', // slate-700
              '&:hover': { bgcolor: '#475569' }, // slate-600
            }}
          >
            {isUploading ? <CircularProgress size={24} color="inherit" /> : "Select Files"}
          </Button>
        </Box>

        {/* 5. REPLACED THIS ENTIRE SECTION */}
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            mt: 4,
            p: 3,
            bgcolor: '#0f172a', // slate-900
            border: 1,
            borderColor: 'background.paper', // slate-800
            borderRadius: '0.75rem',
          }}
        >
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: 'common.white', mb: 2 }}>
            <FaCog className="text-slate-400" /> Storage Options
          </Typography>
          <RadioGroup value={String(saveToVault)} onChange={(e) => setSaveToVault(e.target.value === 'true')}>
            <FormControlLabel
              value="false"
              control={<Radio sx={{ '&, &.Mui-checked': { color: 'primary.light' } }} />}
              label={
                <Box>
                  <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}><FaClock style={{ color: '#3b82f6' }} /> Temporary Drop</Typography>
                  <Typography variant="body2" color="text.secondary">File is securely deleted automatically after 24 hours.</Typography>
                </Box>
              }
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              value="true"
              disabled={!session}
              control={<Radio sx={{ '&, &.Mui-checked': { color: 'primary.light' } }} />}
              label={
                <Box>
                  <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}><FaLock style={{ color: '#10b981' }} /> Save to Personal Vault</Typography>
                  <Typography variant="body2" color="text.secondary">{session ? "File lives forever in your account until you delete it." : "Log in to save files permanently."}</Typography>
                </Box>
              }
            />
          </RadioGroup>

          <Divider sx={{ my: 2, borderColor: 'background.paper' }} />

          <FormControlLabel
            disabled={saveToVault}
            control={<Checkbox checked={burnAfterReading} onChange={(e) => setBurnAfterReading(e.target.checked)} sx={{ '&, &.Mui-checked': { color: 'primary.light' } }} />}
            label={
              <Box>
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500, color: saveToVault ? 'text.disabled' : 'text.primary' }}>
                  <FaFire style={{ color: saveToVault ? '#4b5563' : '#f97316' }} /> Burn after reading
                </Typography>
                <Typography variant="body2" color="text.secondary">File is permanently deleted once the link is opened.</Typography>
              </Box>
            }
          />
        </Paper>

        {/* Success Popup Modal (UNCHANGED) */}
        {/* Success Popup Modal */}
        <Modal
          open={!!downloadUrl}
          onClose={() => {
            setDownloadUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{ backdrop: { timeout: 500, sx: { backdropFilter: 'blur(3px)', backgroundColor: 'rgba(0,0,0,0.8)' } } }}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
        >
          <Fade in={!!downloadUrl}>
            <Paper
              elevation={24}
              sx={{
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'rgba(16, 185, 129, 0.5)',
                p: 4,
                borderRadius: '0.75rem',
                maxWidth: '32rem',
                width: '100%',
                textAlign: 'center',
              }}
            >
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                {saveToVault ? (
                  <FaLock style={{ fontSize: '3rem', color: '#10b981' }} />
                ) : (
                  <FaCheck style={{ fontSize: '3rem', color: '#10b981' }} />
                )}
              </Box>

              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'common.white', mb: 1 }}>
                {saveToVault ? "Securely Vaulted!" : "Upload Complete!"}
              </Typography>

              {saveToVault ? (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    This file is now stored permanently in your vault. You can manage it or share the link from your Vault dashboard.
                  </Typography>
                  <Button component={Link} href="/vault" variant="contained" color="primary" fullWidth sx={{ py: 1.5, mb: 2 }}>
                    Go to My Vault
                  </Button>
                </Box>
              ) : (
                <>
                  <Typography sx={{ color: 'text.secondary', mb: 3 }}>Your secure download link is ready.</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'black', border: 1, borderColor: '#334155', p: 1, borderRadius: '0.5rem', mb: 3 }}>
                    <OutlinedInput
                      type="text"
                      readOnly
                      value={downloadUrl || ''}
                      fullWidth
                      sx={{
                        bgcolor: 'transparent',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        color: 'text.primary',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                      }}
                    />
                    <Button
                      onClick={() => {
                        if (downloadUrl) navigator.clipboard.writeText(downloadUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      variant="contained"
                      color="primary"
                      startIcon={copied ? <FaCheck /> : <FaCopy />}
                      sx={{ flexShrink: 0 }}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </Box>
                </>
              )}

              <MuiLink
                component="button"
                onClick={() => {
                  setDownloadUrl(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                sx={{ color: 'text.disabled', '&:hover': { color: 'text.secondary' }, textDecoration: 'underline', fontSize: '0.875rem' }}
              >
                Close and upload another file
              </MuiLink>
            </Paper>
          </Fade>
        </Modal>
      </Container>
    </Box>
  );
};

export default Upload;