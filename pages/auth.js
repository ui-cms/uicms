import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Auth({}) {
  const { query } = useRouter();
  const code = query.code;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (code) {
      (async () => {
        try {
          const res = await axios.post(`/api/auth?code=${code}`);
          console.log("elnur1", res.data);

          // do octakit call here
        } catch (e) {
          setError(e?.response?.data?.error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [code]);

  if (loading) {
    return (
      <progress className="progress is-medium is-dark" max="100">
        45%
      </progress>
    );
  }
  if (error) {
    return (
      <article className="message is-danger">
        <div className="message-header">
          <p>Erroring signing to GitHub</p>
          <button className="delete" aria-label="delete"></button>
        </div>
        <div className="message-body">{error}</div>
      </article>
    );
  }
  return "success";
}
