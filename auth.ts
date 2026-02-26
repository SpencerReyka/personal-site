import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const isAdmin = request.nextUrl.pathname.startsWith('/admin')
      const isLoggedIn = !!auth?.user
      const isOwner = auth?.user?.email === 'spencer.reyka@gmail.com'
      if (isAdmin) return isLoggedIn && isOwner
      return true
    },
  },
})
