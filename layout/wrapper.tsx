"use client";
import React from "react";
import { ThemeProvider } from '@mui/material/styles';
import theme from "./theme";
/**
 * A Primary Wrapper for Pages within the App.
 *
 * @param {string} props.children - The text to display inside the button.
 * This component serves as a primary wrapper for pages within the application, providing a consistent layout and styling for its child components. It utilizes the ThemeProvider from Material-UI to apply a custom theme across all child components, ensuring a cohesive look and feel throughout the application. The wrapper is designed to be flexible and can accommodate various types of content, making it suitable for use on different pages of the app.
 * @returns {JSX.Element} The rendered PageWrapper component with the applied theme and layout.
 * @example
 * <PageWrapper>
 *   <h1>Welcome to the Task App</h1>
 *   <p>This is the main page of the application.</p>
 * </PageWrapper> 
 */

interface RootLayoutProps {
  children: React.ReactNode;
}
const PageWrapper: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};
export default PageWrapper;
