import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const GUEST_EMAIL = "visitante@fundz.app";

/**
 * Returns true when the authenticated user is the visitor/demo account.
 * Use this to disable write actions in the UI.
 */
export function useIsGuest(): boolean {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsGuest(data.session?.user?.email === GUEST_EMAIL);
    });
  }, []);

  return isGuest;
}
