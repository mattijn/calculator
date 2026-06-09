"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/lib/slugify";

export function StickySectionNav({ items }: { items: { label: string; id: string }[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (!items.length || typeof IntersectionObserver === "undefined") return;
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!id) continue;
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
        }
        if (visible.size === 0) return;
        const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
        if (best) setActiveId(best);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav className="stickySectionNav" aria-label="On this page">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`stickySectionChip${activeId === item.id ? " stickySectionChipActive" : ""}`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function headingItemsFromBlocks(blocks: { type: string; content?: string }[]) {
  return blocks
    .filter((b): b is { type: "heading"; content: string } => b.type === "heading")
    .map((b) => ({ label: b.content, id: slugify(b.content) }));
}
