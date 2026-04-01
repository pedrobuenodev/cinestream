import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/helpers';

export default function RegisterPage() {
  const { register, user } = useAuth();
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
      await register(form);
      router.push('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Create Account — CineStream</title></Head>
      <AuthForm mode="register" onSubmit={handleSubmit} loading={loading} error={error} />
    </>
  );
}
