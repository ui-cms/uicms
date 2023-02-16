// After user signs in, he needs to sent the code to GitHub to obtain access token which will be used to access GitHub API.
// See more at https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github

export default function handler(req, res) {
  const { code } = req.query;

  fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        return res.status(400).json({ error: data.error_description });
      } else {
        const { access_token, token_type } = data;
        return res.status(200).json({ access_token, token_type });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        error: "Something went wrong when signing in with GitHub",
        details: error,
      });
    });
  return;
}
