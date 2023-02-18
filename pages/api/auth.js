// After user signs in, he needs to sent the code along with (OAuth app's) client secret to GitHub to obtain access token which will be used to access GitHub API.
// See more at https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github

export default async function handler(req, res) {
  const { code } = req.query;

  let result;
  try {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
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
      }
    );

    const data = await response.json();

    if (data.error) {
      result = res.status(400).json({ error: data });
    } else {
      const { access_token, token_type } = data;
      result = res.status(200).json({ access_token, token_type });
    }
  } catch (error) {
    result = res.status(500).json({ error });
  }
  return result;
}
