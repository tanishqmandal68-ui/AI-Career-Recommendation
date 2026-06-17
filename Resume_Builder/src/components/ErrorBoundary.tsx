import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-surface p-8">
          <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center">
            <h1 className="text-lg font-bold text-red-600">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted">{this.state.error.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary mt-6 cursor-pointer rounded-xl px-6 py-2 text-sm font-semibold text-white"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
