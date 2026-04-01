import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import {
  FiSearch, FiBell, FiChevronDown, FiLogOut,
  FiUser, FiBookmark, FiMenu, FiX,
} from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cine-dark shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span
            className="text-cine-red font-bold tracking-wider text-2xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.15em' }}
          >
            CINESTREAM
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link href="/" className={`hover:text-white transition-colors ${router.pathname === '/' ? 'text-white font-medium' : ''}`}>
            Home
          </Link>
          <Link href="/?type=series" className="hover:text-white transition-colors">
            Series
          </Link>
          <Link href="/?type=movie" className="hover:text-white transition-colors">
            Movies
          </Link>
          {user && (
            <Link href="/watchlist" className={`hover:text-white transition-colors ${router.pathname === '/watchlist' ? 'text-white font-medium' : ''}`}>
              My List
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titles, genres..."
                className="bg-black/80 border border-white/30 text-white text-sm px-3 py-1.5 rounded outline-none w-48 md:w-64 placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="ml-2 text-gray-400 hover:text-white"
              >
                <FiX size={18} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-300 hover:text-white transition-colors p-1"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>
          )}

          {user ? (
            <>
              <button className="text-gray-300 hover:text-white transition-colors p-1 hidden md:block">
                <FiBell size={20} />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center gap-2 text-sm text-gray-200 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-cine-red flex items-center justify-center font-semibold text-white text-xs uppercase">
                    {user.name?.[0] || 'U'}
                  </div>
                  <FiChevronDown size={14} className={`hidden md:block transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-44 bg-cine-card border border-white/10 rounded-lg shadow-2xl py-1 animate-fade-in">
                    <div className="px-4 py-2 border-b border-white/10 text-xs text-gray-400 truncate">
                      {user.email}
                    </div>
                    <Link
                      href="/watchlist"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <FiBookmark size={14} /> My List
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <FiLogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-gray-300 hover:text-white transition-colors hidden md:block"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm bg-cine-red hover:bg-cine-red-hover text-white px-4 py-1.5 rounded font-medium transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-1"
            onClick={() => setMenuOpen((m) => !m)}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cine-dark border-t border-white/10 px-4 py-4 flex flex-col gap-4 animate-fade-in">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white">Home</Link>
          <Link href="/?type=series" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white">Series</Link>
          <Link href="/?type=movie" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white">Movies</Link>
          {user && (
            <Link href="/watchlist" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white">My List</Link>
          )}
        </div>
      )}
    </nav>
  );
}
