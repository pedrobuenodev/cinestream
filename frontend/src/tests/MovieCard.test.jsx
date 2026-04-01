import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieCard from '@/components/MovieCard';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }) => <img alt={alt} {...props} />,
}));

// Mock hooks
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 1, name: 'Test User' } }),
}));

jest.mock('@/hooks/useWatchlist', () => ({
  useWatchlist: () => ({
    isInWatchlist: () => false,
    toggle: jest.fn(),
  }),
}));

const mockMovie = {
  id: 1,
  title: 'Inception',
  year: 2010,
  rating: 8.8,
  duration: 148,
  type: 'movie',
  poster_url: 'https://image.tmdb.org/t/p/w500/test.jpg',
  category: { id: 1, name: 'Sci-Fi', slug: 'sci-fi' },
};

describe('MovieCard', () => {
  it('renders movie title', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  it('renders movie year', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText('2010')).toBeInTheDocument();
  });

  it('renders poster image', () => {
    render(<MovieCard movie={mockMovie} />);
    const img = screen.getByAltText('Inception');
    expect(img).toBeInTheDocument();
  });

  it('shows fallback when no poster', () => {
    render(<MovieCard movie={{ ...mockMovie, poster_url: null }} />);
    expect(screen.getByText('🎬')).toBeInTheDocument();
  });

  it('is keyboard accessible', () => {
    const { container } = render(<MovieCard movie={mockMovie} />);
    const card = container.querySelector('[role="button"]');
    expect(card).toHaveAttribute('tabIndex', '0');
  });
});
