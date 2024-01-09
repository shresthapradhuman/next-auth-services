/**
 * An Array of public routes
 * @date 1/7/2024 - 10:59:28 PM
 *
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * An Array of auth routes
 * These routes will redirect the logged in user to the settings
 * @date 1/7/2024 - 10:59:28 PM
 *
 * @type {string[]}
 */

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for the api routes
 * Routes that start with this prefix will be treated as api authentication routes
 * @date 1/7/2024 - 11:02:10 PM
 *
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect url path after logged in
 * @date 1/7/2024 - 11:03:46 PM
 *
 * @type {string}
 */
export const DEFAULT_REDIRECT_URL = "/settings";
