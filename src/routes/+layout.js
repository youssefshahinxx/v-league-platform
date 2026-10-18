import { getSession } from '$lib/auth';

export const ssr = false;

export async function load() {
  const session = await getSession();

  return {
    session
  };
}