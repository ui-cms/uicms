import { useRef } from "react";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { displayError } from "@/helpers/utilities";
import { useRouter } from "next/router";

export default function useAuth() {
  const router = useRouter();
  const loading = useRef(true);
  const { state, dispatchAction } = useStateManagement();
  const { authToken } = state;

  /**
   * Will check if there is any auth token cached, if found will set in state management
   */
  async function tryCachedAuthToken() {
    if (!authToken && loading.current) {
      loading.current = false;
      try {
        const res = await fetch("/api/auth/cachedToken");
        const data = await res.json();
        if (data.access_token) {
          dispatchAction.setAuthToken(data.access_token);
        }
      } catch (e) {
        displayError("Error fetching cached auth token!", e);
      }
    }
  }

  /**
   * Will destroy iron-session cookie and reset state management before redirecting to home page
   */
  async function signOut() {
    if (authToken && loading.current) {
      loading.current = false;
      try {
        await fetch("/api/auth/signOut");
        dispatchAction.reset();
      } catch (e) {
        displayError("Error signing out!", e);
      } finally {
        router.push("/");
      }
    }
  }

  return { tryCachedAuthToken, signOut };
}
