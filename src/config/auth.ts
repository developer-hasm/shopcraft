export const PROTECTED_ROUTES = ["/dashboard"] as const;
export const AUTH_ONLY_ROUTES = ["/login", "/signup"] as const;
export const POST_LOGIN_REDIRECT = "/";
export const LOGIN_PATH = "/login";
export const SIGNUP_PATH = "/signup";
export const DASHBOARD_PATH = "/dashboard";
export const CALLBACK_PATH = "/callback";
export const MIN_PASSWORD_LENGTH = 8;
export const ROOT_LAYOUT_PATH = "/";
export const USER_METADATA_DISPLAY_NAME = "display_name";

/** Generic error messages to avoid leaking implementation details */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password.",
  SIGNUP_FAILED: "Could not create account. Please try again.",
  OAUTH_FAILED: "Could not sign in with Google. Please try again.",
  GENERIC: "Something went wrong. Please try again.",
} as const;

/** Error codes used in OAuth callback redirect query params */
export const CALLBACK_ERROR_CODES = {
  MISSING_CODE: "missing_code",
  CALLBACK_FAILED: "auth_callback_failed",
  OAUTH_DENIED: "oauth_denied",
} as const;
