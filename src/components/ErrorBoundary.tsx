import React, { Component, type ErrorInfo, type ReactNode } from 'react';

import { Error } from '@components/Error';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Error
          heading="Something went wrong!"
          message="An unexpected error occurred. Please try refreshing the app."
          labelPrimary="Reload"
          onPrimary={() => {
            this.setState({ hasError: false, error: undefined });
          }}
        />
      );
    }

    return this.props.children;
  }
}
