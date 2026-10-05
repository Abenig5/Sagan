import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/** Throws if called outside an authenticated admin session. Server actions run
 * on the server and are reachable directly, so middleware alone isn't enough. */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}
