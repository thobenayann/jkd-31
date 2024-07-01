import 'server-only';

export const token = process.env.SANITY_API_READ_TOKEN;

if (!token) {
    throw new Error('Missing SANITY_API_READ_TOKEN');
}

// Ensure this file is only used server-side
if (typeof window !== 'undefined') {
    throw new Error('Do not import `token.ts` on the client-side');
}
