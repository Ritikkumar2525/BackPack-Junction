"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster 
      position="top-center"
      toastOptions={{
        style: {
          background: '#1A2332',
          color: '#F5F0E8',
          border: '1px solid rgba(255,255,255,0.1)',
        },
        success: {
          iconTheme: {
            primary: '#1ABC9C',
            secondary: '#1A2332',
          },
        },
      }} 
    />
  );
}
