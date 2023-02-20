import { useEffect, useState } from "react";

/**
 * This React hook will allow to use browser storages (sessionStorage or localStorage).
 * Next.js performs a server render before the client render, therefore as default it will complain that storage is not defined.
 * As useEffect hook only runs in client side, it is guaranteed that storages will be defined within it.
 * @param {string} key the key of the item to set in storage
 * @param {string} type storage type: sessionStorage (default) or localStorage
 * @returns
 */
export default function useStorage(key, type = "sessionStorage") {
  const [value, setValue] = useState();

  // Initial fetch from storage
  useEffect(() => {
    const storage = type === "sessionStorage" ? sessionStorage : localStorage;
    setValue(storage.getItem(key));
  }, [key, type]);

  // Persist to storage
  useEffect(() => {
    // first render, don't override (i.e lose) existing item value
    if (value !== undefined) {
      const storage = type === "sessionStorage" ? sessionStorage : localStorage;
      if (value === null) storage.removeItem(key);
      else storage.setItem(key, value);
    }
  }, [key, value, type]);

  return [value, setValue];
}
