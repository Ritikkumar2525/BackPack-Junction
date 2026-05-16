"use client";

import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 w-full h-full">
          <div className="bg-[#0d141e]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30">
              <AlertTriangle className="text-red-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-cream mb-3 font-[family-name:var(--font-heading)]">
              Something went wrong
            </h2>
            <p className="text-cream/50 text-sm mb-8">
              We encountered an unexpected error while loading this section. Please try refreshing.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-burnt-orange to-[#a35e27] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full justify-center"
            >
              <RefreshCcw size={18} />
              Reload Page
            </button>
            
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-6 p-4 bg-black/40 rounded-xl w-full overflow-auto text-left border border-white/5">
                <p className="text-red-400 text-xs font-mono break-all">{this.state.error.toString()}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary(Component) {
  return function WithErrorBoundary(props) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
