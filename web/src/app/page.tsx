 "use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function detectLocale(): "en" | "nl" | "zh" {
  const browserLang = navigator.language?.toLowerCase() ?? "";
  if (browserLang.startsWith("zh")) return "zh";
  if (browserLang.startsWith("nl")) return "nl";
  return "en";
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${detectLocale()}`);
  }, [router]);

  return null;
}
