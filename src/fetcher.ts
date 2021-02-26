const root = 'https://a.deephire.com';

const fetcher = async (url: string) => {
  const res = await fetch(`${root}${url}`);

  if (!res.ok) {
    throw new Error('Error status code');
  }
  return res.json();
};

export const putter = async (url: string, data: any) => {
  const body = JSON.stringify(data);
  const headers = { 'Content-Type': 'application/json' };
  const res = await fetch(`${root}${url}`, { method: 'PUT', body, headers });

  if (!res.ok) {
    throw new Error('Error status code');
  }
};

export default fetcher;
