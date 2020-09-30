const root = 'https://a.deephire.com';

const fetcher = async (url: string) => {
  const res = await fetch(`${root}${url}`);

  if (!res.ok) {
    throw new Error('Error status code');
  }
  return res.json();
};

export default fetcher;
