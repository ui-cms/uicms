import { ironSessionOptions } from "@/helpers/constants";
import { withIronSessionApiRoute } from "iron-session/next";

/**
 * Fetch token stored in iron-session cookie and return in reponse
 */
async function getTokenFromIronSessionCookie(req, res) {
  const { token } = req.session;
  if (token) {
    return res.status(200).json(token); // token = { access_token, token_type, scope }
  } else {
    return res.status(404).json({ message: "not found" });
  }
}

export default withIronSessionApiRoute(
  getTokenFromIronSessionCookie,
  ironSessionOptions
);
