import { ironSessionOptions } from "@/helpers/constants";
import { withIronSessionApiRoute } from "iron-session/next";

/**
 * Fetch token stored in iron-session cookie and return in reponse
 */
async function destroyIronSessionCookie(req, res, session) {
  req.session.destroy();
  return res.status(200).json({ message: "ok" });
}

export default withIronSessionApiRoute(
  destroyIronSessionCookie,
  ironSessionOptions
);
