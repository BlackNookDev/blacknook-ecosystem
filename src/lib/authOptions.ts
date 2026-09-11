import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import pool from './db';
import { ensureAuthEnv, getAuthSecret } from './authEnv';
import {
  DEV_AUTO_LOGIN_PASSWORD,
  DEV_AUTO_LOGIN_DISPLAY_NAME,
  getDevAutoLoginEmail,
  isCredentialsAutoLoginEnabled,
  isGoogleOAuthEnabled,
} from './authMode';

ensureAuthEnv();

function getAuthCookieDomain(): string | undefined {
  const explicit = process.env.AUTH_COOKIE_DOMAIN?.trim();
  return explicit || undefined;
}

const authCookieDomain = getAuthCookieDomain();
const useSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith('https://') === true ||
  Boolean(process.env.VERCEL);

async function ensureOAuthUser(params: {
  email: string;
  name?: string | null;
  image?: string | null;
  role?: string | null;
}) {
  const email = params.email.toLowerCase().trim();
  const [rows]: any = await pool.query('SELECT id, role FROM users WHERE LOWER(email) = ?', [
    email,
  ]);
  if (rows[0]) {
    return { id: Number(rows[0].id), role: rows[0].role as string, created: false };
  }

  const role = params.role === 'vendor' ? 'vendor' : 'user';
  const name = params.name?.trim() || email.split('@')[0];
  const placeholderPassword = await bcrypt.hash(
    `oauth:${email}:${getAuthSecret()}`,
    12
  );
  const [result]: any = await pool.query(
    'INSERT INTO users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)',
    [name, email, placeholderPassword, role, params.image ?? null]
  );

  try {
    const { welcomeRegisterEmail } = await import('./emailTemplates');
    const { sendUserEmail } = await import('./mail');
    const welcome = welcomeRegisterEmail({ name, email });
    const mailResult = await sendUserEmail({ to: email, ...welcome });
    if (!mailResult.ok) {
      console.warn('[oauth] Hoş geldin maili gönderilemedi:', mailResult.error);
    }
  } catch (mailError) {
    console.warn('[oauth] Hoş geldin maili hatası:', mailError);
  }

  return { id: Number(result.insertId), role, created: true };
}

const providers: AuthOptions['providers'] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'E-posta', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase();
      const password = credentials?.password;

      // Geçici Google bypass / dev auto-login: yalnızca özel şifre ile.
      // Normal e-posta+şifre akışını engellemez.
      if (
        isCredentialsAutoLoginEnabled() &&
        password === DEV_AUTO_LOGIN_PASSWORD
      ) {
        const loginEmail = email || getDevAutoLoginEmail();
        const [rows]: any = await pool.query('SELECT * FROM users WHERE LOWER(email) = ?', [
          loginEmail,
        ]);
        const existing = rows[0];
        if (existing) {
          const name =
            !existing.name || existing.name.toLowerCase() === 'demo'
              ? DEV_AUTO_LOGIN_DISPLAY_NAME
              : existing.name;
          return {
            id: String(existing.id),
            name,
            email: existing.email,
            role: existing.role,
          };
        }

        const dbUser = await ensureOAuthUser({
          email: loginEmail,
          name: DEV_AUTO_LOGIN_DISPLAY_NAME,
          role: 'user',
        });
        const [created]: any = await pool.query('SELECT * FROM users WHERE id = ?', [dbUser.id]);
        const user = created[0];
        if (!user) return null;
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }

      if (!email || !password) return null;

      const [rows]: any = await pool.query('SELECT * FROM users WHERE LOWER(email) = ?', [email]);
      const user = rows[0];
      if (!user) return null;
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return null;
      return {
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
      };
    },
  }),
];

if (isGoogleOAuthEnabled()) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const authOptions: AuthOptions = {
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) return false;
        try {
          let pendingRole: string | null = null;
          try {
            const { cookies } = await import('next/headers');
            pendingRole = cookies().get('pending_register_role')?.value ?? null;
          } catch {
            pendingRole = null;
          }

          const dbUser = await ensureOAuthUser({
            email: user.email,
            name: user.name,
            image: user.image,
            role: pendingRole,
          });
          (user as { id?: string }).id = String(dbUser.id);
          (user as { role?: string }).role = dbUser.role;
          return true;
        } catch (error) {
          console.error('OAuth kullanıcı oluşturma hatası:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, account }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = Number((user as { id?: string | number }).id);
      }

      if (
        account?.provider === 'google' &&
        token.email &&
        (token.id == null || !Number.isFinite(Number(token.id)))
      ) {
        const [rows]: any = await pool.query('SELECT id, role FROM users WHERE LOWER(email) = ?', [
          String(token.email).toLowerCase(),
        ]);
        if (rows[0]) {
          token.id = Number(rows[0].id);
          token.role = rows[0].role;
        }
      }

      if ((token.id == null || !Number.isFinite(Number(token.id))) && token.email) {
        const [rows]: any = await pool.query('SELECT id, role FROM users WHERE LOWER(email) = ?', [
          String(token.email).toLowerCase(),
        ]);
        if (rows[0]) {
          token.id = Number(rows[0].id);
          token.role = rows[0].role;
        }
      }
      if (trigger === 'update' && token.id) {
        const [rows]: any = await pool.query('SELECT role FROM users WHERE id = ?', [token.id]);
        if (rows[0]) token.role = rows[0].role;
      }
      return token;
    },
    async session({ session, token }) {
      const userId = token.id != null ? Number(token.id) : null;
      (session.user as { id?: number }).id = Number.isFinite(userId as number)
        ? (userId as number)
        : (token.id as number);
      if (token.id) {
        const [rows]: any = await pool.query('SELECT role FROM users WHERE id = ?', [token.id]);
        (session.user as { role?: string }).role = rows[0]?.role ?? (token.role as string);
      } else {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  secret: getAuthSecret(),
  useSecureCookies,
  cookies: authCookieDomain
    ? {
        sessionToken: {
          name: useSecureCookies
            ? '__Secure-next-auth.session-token'
            : 'next-auth.session-token',
          options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: useSecureCookies,
            domain: authCookieDomain,
          },
        },
      }
    : undefined,
};
