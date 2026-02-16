export const SESSION_COOKIE_NAME = "crm_session";

export function getAuthConfig() {
  return {
    email: process.env.AUTH_EMAIL ?? "krcoffelt@gmail.com",
    password: process.env.AUTH_PASSWORD ?? "hometown",
    sessionToken: process.env.AUTH_SESSION_TOKEN ?? "local-dev-session-token"
  };
}

export function isValidCredentials(email: string, password: string) {
  const config = getAuthConfig();
  return email.trim().toLowerCase() === config.email.trim().toLowerCase() && password === config.password;
}

export function isValidSessionToken(token?: string) {
  if (!token) return false;
  const config = getAuthConfig();
  return token === config.sessionToken;
}
