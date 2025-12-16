export const getGoogleOAuthURL = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  // Generate random state for CSRF protection
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state in sessionStorage for verification (optional but recommended)
  if (typeof window !== "undefined") {
    sessionStorage.setItem("google_oauth_state", state);
  }

  const options = {
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL || "",
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: ["openid", "email", "profile"].join(" "),
    state, // CSRF protection
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};