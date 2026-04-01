export const formatDuration = (minutes) => {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const formatRating = (rating) =>
  rating ? Number(rating).toFixed(1) : '—';

export const getImageUrl = (url, fallback = '/placeholder.jpg') =>
  url || fallback;

export const truncate = (str, n = 150) =>
  str?.length > n ? str.slice(0, n) + '…' : str;

export const getErrorMessage = (err) =>
  err?.response?.data?.error || err?.message || 'Something went wrong';
