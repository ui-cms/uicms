export const ironSessionOptions = {
    password: process.env.IRON_SESSION_COOKIE_PASSWORD,
    cookieName: "ironSessionCookie",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",    // secure only in production (https), can't be in development (http)
    },
  };