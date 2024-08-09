import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Temporarily use process.env directly for debugging
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SECRET = process.env.SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !SECRET) {
  console.error('Missing environment variables');
}

export default NextAuth({
  providers: [
    GoogleProvider({
      //@ts-ignore
      clientId: GOOGLE_CLIENT_ID,
      //@ts-ignore
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],

  secret: SECRET,

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, account }) {
      console.log('JWT callback', { token, account });
      if (account) {
        const { access_token, provider } = account;
        token.provider = provider;
        token.access_token = access_token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback', { session, token });
      const { access_token, provider } = token;
      //@ts-ignore
      session.provider = provider;
      //@ts-ignore
      session.access_token = access_token;
      return session;
    },
  },

  events: {
    async signIn(message) {
      console.log('User signed in', message);
    },
    async signOut(message) {
      console.log('User signed out', message);
    },
    //@ts-ignore
    async error(message) {
      console.error('Error:', message);
    },
  },

  // debug: process.env.NODE_ENV === 'development',
});
