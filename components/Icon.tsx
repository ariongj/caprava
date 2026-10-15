// CAPRAVA line icons: 24px grid, 1.4 stroke, drawn in currentColor.
const paths = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z" />,
  bag: <><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  truck: <><path d="M3 6.5h11v10H3zM14 9.5h4l3 3.2v3.8h-7" /><circle cx="7" cy="17.5" r="1.7" /><circle cx="17.5" cy="17.5" r="1.7" /></>,
  cash: <><rect x="2.5" y="6.5" width="19" height="11" rx="1.6" /><circle cx="12" cy="12" r="2.6" /><path d="M6 9.5v5M18 9.5v5" /></>,
  shield: <><path d="M12 3 19 6v5c0 4.6-3 8.3-7 10-4-1.7-7-5.4-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  returns: <><path d="M4.5 9.5H15a4.5 4.5 0 0 1 0 9H8" /><path d="M7.5 6.5 4.5 9.5l3 3" /></>,
  card: <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3 10h18M6.5 15h4" /></>,
  drop: <path d="M12 3.5c3.6 4.4 6 7.9 6 10.9a6 6 0 0 1-12 0c0-3 2.4-6.5 6-10.9Z" />,
  diamond: <><path d="M6.5 4h11L21 9l-9 11L3 9l3.5-5Z" /><path d="M3 9h18M12 20 8.5 9 12 4l3.5 5L12 20" /></>,
  book: <><path d="M3 5.5c3-1.2 6-1.1 9 1 3-2.1 6-2.2 9-1v13.5c-3-1.2-6-1.1-9 1-3-2.1-6-2.2-9-1V5.5Z" /><path d="M12 6.5v13" /></>,
  citrus: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="5.6" /><path d="M12 6.4v11.2M7.2 9.2l9.6 5.6M7.2 14.8l9.6-5.6" /></>,
  fruit: <><circle cx="12" cy="10" r="2.4" /><circle cx="9" cy="13.5" r="2.4" /><circle cx="15" cy="13.5" r="2.4" /><circle cx="12" cy="17" r="2.4" /><path d="M12 7.6c0-2 1-3.4 3.2-3.8" /></>,
  spice: <><path d="M5 19.5c6.8.8 12.6-4.6 12.3-10.7 0-1-.8-1.6-1.8-1.3-1.4 4.4-5.4 8.7-10.2 9.6-1.4.3-1.6 2.1-.3 2.4Z" /><path d="M16 7.4c-.1-1.6.6-2.8 2.2-3.4" /></>,
  floral: <><circle cx="12" cy="12" r="2" /><circle cx="12" cy="6.6" r="3" /><circle cx="17.2" cy="10.3" r="3" /><circle cx="15.2" cy="16.4" r="3" /><circle cx="8.8" cy="16.4" r="3" /><circle cx="6.8" cy="10.3" r="3" /></>,
  gourmand: <><path d="M7 9.5h10l-1 9.5a2 2 0 0 1-2 1.8h-4A2 2 0 0 1 8 19L7 9.5Z" /><path d="M5.8 9.5h12.4M9.5 9.5V7.3h5v2.2M12 13v2.6" /></>,
  balsamic: <><path d="M9 11h6v10H9z" /><path d="M12 3c1.6 2 2.2 3.2 2.2 4.3a2.2 2.2 0 0 1-4.4 0C9.8 6.2 10.6 5 12 3Z" /><path d="M12 9.5V11" /></>,
  woody: <><path d="M12 3 6.3 11h3.2l-4.2 6.2h13.4L14.5 11h3.2L12 3Z" /><path d="M12 17.2V21" /></>,
  amber: <><path d="M12 3 19 7v10l-7 4-7-4V7l7-4Z" /><path d="m9 8.4 2.2-1.2M5 7l7 4 7-4M12 11v10" /></>,
  musk: <path d="M7 18.5h10.2a4 4 0 0 0 .4-8 5.6 5.6 0 0 0-10.8 1.6A3.3 3.3 0 0 0 7 18.5Z" />,
  leaf: <><path d="M5 19C5 10.2 11 5 20 4c-1 9-6.2 15-15 15Z" /><path d="m5 19 8-8" /></>,
  store: <><path d="M4.5 10.5V20h15v-9.5" /><path d="M3 10.5 5 4h14l2 6.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0Z" /><path d="M10 20v-5h4v5" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5S14.4 18.1 12 20.5C9.6 18.1 8.4 15.3 8.4 12S9.6 5.9 12 3.5Z" /></>,
  star: <path d="m12 3.5 2.6 5.3 5.8.9-4.2 4 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4 5.8-.9L12 3.5Z" />,
  chart: <><path d="M4 4v16h16" /><path d="m7.5 15 4-4 3 3 5-6" /></>,
  mail: <><rect x="3" y="5.5" width="18" height="13" rx="1.6" /><path d="m3.6 6.6 8.4 6.4 8.4-6.4" /></>,
  pin: <><path d="M12 21s6.2-5.5 6.2-11a6.2 6.2 0 0 0-12.4 0c0 5.5 6.2 11 6.2 11Z" /><circle cx="12" cy="10" r="2.3" /></>,
  phone: <path d="M6.6 3.8 9 3.5l1.6 4.2-2 1.4a11 11 0 0 0 6.3 6.3l1.4-2 4.2 1.6-.3 2.4a2 2 0 0 1-2.2 1.7C10.5 18.4 5.6 13.5 4.9 6a2 2 0 0 1 1.7-2.2Z" />,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="4.6" /><circle cx="12" cy="12" r="3.7" /><circle cx="16.9" cy="7.1" r=".6" fill="currentColor" /></>,
  tiktok: <><path d="M14 4v10.6a3.6 3.6 0 1 1-3.6-3.6" /><path d="M14 4c.5 2.7 2.4 4.4 5 4.6" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  spray: <><path d="M7.5 10.5h8v9.5a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-9.5Z" /><path d="M9.5 10.5V7.5h4v3M10.5 7.5V5.5h2" /><path d="M16 5h.01M18.5 4h.01M18.5 6.8h.01M21 5.4h.01" strokeWidth="2" /></>,
  compass: <><circle cx="12" cy="12" r="8.5" /><path d="m15.6 8.4-2.2 5-5 2.2 2.2-5 5-2.2Z" /></>,
  sun: <><circle cx="12" cy="12" r="3.8" /><path d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.5 5.5l1.6 1.6M16.9 16.9l1.6 1.6M5.5 18.5l1.6-1.6M16.9 7.1l1.6-1.6" /></>,
  moon: <path d="M19.5 14.6A7.8 7.8 0 0 1 9.4 4.5a7.8 7.8 0 1 0 10.1 10.1Z" />,
  arrow: <path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5" />,
  gift: <><rect x="3.5" y="8.5" width="17" height="4" rx="1" /><path d="M5 12.5V20h14v-7.5M12 8.5V20M12 8.5c-1.6-3.6-6-3.6-5 0M12 8.5c1.6-3.6 6-3.6 5 0" /></>,
  sparkle: <path d="M12 3c.5 4.6 3.4 7.5 8 8-4.6.5-7.5 3.4-8 8-.5-4.6-3.4-7.5-8-8 4.6-.5 7.5-3.4 8-8Z" />,
  goat: <><path d="M7.5 9C6 6.5 6.5 4 8.5 3c-.5 2 0 3.5 1.5 4.5M16.5 9C18 6.5 17.5 4 15.5 3c.5 2 0 3.5-1.5 4.5" /><path d="M8.5 9.5c0-1.4 1.6-2.5 3.5-2.5s3.5 1.1 3.5 2.5V14l-2 4.5h-3l-2-4.5V9.5Z" /><path d="M10.5 18.5 11 21h2l.5-2.5M10 11.5h.01M14 11.5h.01" /></>,
  user: <><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20.5c1.2-3.8 4-5.8 7.5-5.8s6.3 2 7.5 5.8" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className, label }: { name: IconName; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`icon${className ? ` ${className}` : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {paths[name]}
    </svg>
  );
}

// Icon for each ingredient family of the CAPRAVA palette (keyed by English name).
export const familyIcon: Record<string, IconName> = {
  Citrus: "citrus",
  Fruit: "fruit",
  Spice: "spice",
  Floral: "floral",
  Gourmand: "gourmand",
  Balsamic: "balsamic",
  Woody: "woody",
  Amber: "amber",
  Musk: "musk",
};
