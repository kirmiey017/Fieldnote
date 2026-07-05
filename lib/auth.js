// Kept deliberately simple (no external session library) so the whole
// auth flow is readable in one file. The cookie's value is just your
// SESSION_SECRET itself: it's httpOnly (JS on the page can't read it) and
// only ever set server-side after a correct password, so this is fine for
// a single-operator dashboard. If you want proper multi-user auth later,
// swap this for NextAuth or Clerk.

const COOKIE_NAME = "dashboard_session";

export function makeSessionCookieValue() {
  return process.env.SESSION_SECRET || "dev-secret";
}

export function isValidSessionCookie(cookieValue) {
  const expected = process.env.SESSION_SECRET || "dev-secret";
  return !!cookieValue && cookieValue === expected;
}

export function checkPassword(candidate) {
  const real = process.env.DASHBOARD_PASSWORD || "";
  return !!real && candidate === real;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
