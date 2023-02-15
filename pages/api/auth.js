import axios from "axios";

export default async function handler(req, res) {
  const { code } = await req.query;

  let result;
  try {
    result = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    if (result.data.error) {
      await res.status(400).json({ error: result.data.error_description });
      return;
    }
  } catch (e) {
    await res
      .status(500)
      .json({ error: `Something went wrong. Details: ${JSON.stringify(e)}` });
    return;
  }

  const { access_token, token_type } = result.data;
  await res.status(200).json({ access_token, token_type });
  return;
}
