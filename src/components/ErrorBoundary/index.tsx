import { Component } from 'react';

type Props = ExpectedAny;
type State = ExpectedAny;

class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="pw-h-screen pw-w-full pw-flex-col pw-items-center pw-justify-center pw-flex">
          <p className="pw-text-4xl pw-font-bold">Oops, Something went wrong!</p>
          <p className="pw-text-xl">Please again try later!</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
