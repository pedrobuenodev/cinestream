import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/helpers';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  const handleSubmit = async (form) => {
    setLoading(true);
    setError('');
    try {
      await login({ email: form.email, password: form.password });
      router.push('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Sign In — CineStream</title></Head>
      <AuthForm mode="login" onSubmit={handleSubmit} loading={loading} error={error} />
    </>
  );
}
