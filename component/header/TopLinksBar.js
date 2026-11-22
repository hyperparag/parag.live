import Link from "next/link";

const linkStyle = {
  color: "var(--accent)",
  fontSize: "0.8rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  textDecoration: "none",
};

// Only http(s) URLs and site paths are rendered as links.
const isSafeHref = (href) =>
  typeof href === "string" && /^(https?:\/\/|\/)/i.test(href.trim());

/**
 * The bar under the site header. The admin sets up to three links
 * (label1/url1 .. label3/url3). If none are set, nothing is rendered.
 */
const TopLinksBar = ({ links }) => {
  const items = [1, 2, 3]
    .map((n) => ({ label: links?.[`label${n}`], href: links?.[`url${n}`] }))
    .filter((item) => item.label && isSafeHref(item.href));

  if (items.length === 0) return null;

  return (
    <div
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "10px 24px",
        display: "flex",
        justifyContent: "center",
        gap: "32px",
        flexWrap: "wrap",
      }}
    >
      {items.map((item) => (
        <Link
          key={item.label + item.href}
          target='_blank'
          rel='noopener noreferrer nofollow sponsored'
          href={item.href.trim()}
          style={linkStyle}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default TopLinksBar;
