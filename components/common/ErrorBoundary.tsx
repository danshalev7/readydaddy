import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 text-center">
            <div className="bg-pure-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-lg">
                <h1 className="text-2xl font-bold text-alert-red mb-4">Oops! Something went wrong.</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    We're sorry for the inconvenience. Please try reloading the page. If the problem persists, please contact support.
                </p>
                <button
                    onClick={this.handleReload}
                    className="bg-primary-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105 active:scale-95 shadow-md"
                >
                    Reload Page
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
