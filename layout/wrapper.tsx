"use client";
import React, { useState } from "react";
import { ThemeProvider } from '@mui/material/styles';
import { Box, Drawer } from '@mui/material';
import theme from "./theme";
import Header from "./header";
import Aside from "./aside";
import Footer from "./footer"; 
import { SessionProvider } from "next-auth/react";

interface RootLayoutProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<RootLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Header onMenuClick={handleDrawerToggle} />
          
          <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
            
            {/* 1. MOBILE SIDEBAR (The Drawer) */}
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }} 
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { width: 256, boxSizing: 'border-box', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b' }, 
              }}
            >
              <Aside />
            </Drawer>

            {/* 2. DESKTOP SIDEBAR (Permanent) */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, width: 256, flexShrink: 0 }}>
              <Aside />
            </Box>

            {/* 3. MAIN CONTENT & FOOTER */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

              {/* Scrollable Page Content */}
              <Box component="main" className="bg-black" sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {children}
              </Box>

              {/* Pinned Footer (Always visible at the bottom) */}
              <Footer />

            </Box>

          </Box>
        </Box>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default PageWrapper;