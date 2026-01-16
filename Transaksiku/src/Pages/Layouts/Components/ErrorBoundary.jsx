import React, { Component } from "react";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-red-50 p-4 rounded-full mb-4">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Terjadi Kesalahan!
          </h2>
          <p className="text-gray-500 mb-6 max-w-md">
            Maaf, aplikasi mengalami gangguan. Silakan coba muat ulang halaman.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mb-6 w-full max-w-lg text-left overflow-auto max-h-40">
            <code className="text-xs text-red-600 font-mono">
              {this.state.error?.toString()}
            </code>
          </div>
          <Button onClick={this.handleReload} variant="primary">
            Muat Ulang Halaman
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
