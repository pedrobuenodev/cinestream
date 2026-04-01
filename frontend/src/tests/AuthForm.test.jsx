import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthForm from '@/components/AuthForm';

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

describe('AuthForm — Login mode', () => {
  it('renders email and password fields', () => {
    render(<AuthForm mode="login" onSubmit={jest.fn()} loading={false} error="" />);
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('renders Sign In button', () => {
    render(<AuthForm mode="login" onSubmit={jest.fn()} loading={false} error="" />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<AuthForm mode="login" onSubmit={jest.fn()} loading={false} error="Invalid credentials" />);
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', () => {
    const onSubmit = jest.fn();
    render(<AuthForm mode="login" onSubmit={onSubmit} loading={false} error="" />);

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'test@test.com', password: 'secret123' })
    );
  });

  it('disables button when loading', () => {
    render(<AuthForm mode="login" onSubmit={jest.fn()} loading={true} error="" />);
    expect(screen.getByRole('button', { name: '' })).toBeDisabled();
  });
});

describe('AuthForm — Register mode', () => {
  it('renders name field', () => {
    render(<AuthForm mode="register" onSubmit={jest.fn()} loading={false} error="" />);
    expect(screen.getByPlaceholderText('Pedro Silva')).toBeInTheDocument();
  });

  it('renders Create Account button', () => {
    render(<AuthForm mode="register" onSubmit={jest.fn()} loading={false} error="" />);
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });
});
