import { Component, type ErrorInfo, type ReactNode } from 'react';
import ThreeScene from './components/ThreeScene';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    document.getElementById('boot-veil')?.remove();
  }

  render() {
    if (this.state.error) {
      return (
        <main className="error-state">
          <div>
            <span>HANDYTRUST</span>
            <h1>The 3D workshop could not start.</h1>
            <p>Try an up-to-date browser with hardware acceleration enabled.</p>
            <button type="button" onClick={() => window.location.reload()}>
              Reload experience
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <main id="top">
        <ThreeScene />
      </main>
    </ErrorBoundary>
  );
}
