/**
 * Product image, or an honest branded tile when there's no real photo yet
 * (we never borrow another dish's photo). Portrait reel stills are cropped
 * to a square via object-cover; pizzas sit centre-frame so this reads well.
 */
export default function PizzaTile({ image, name, eager = false }: { image: string | null; name: string; eager?: boolean }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={name} loading={eager ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover" style={{ aspectRatio: "1/1" }} />;
  }
  return (
    <div className="grid h-full w-full place-items-center bg-charcoal-2" style={{ aspectRatio: "1/1" }} aria-label={`${name} (photo coming soon)`}>
      <svg viewBox="0 0 120 120" className="h-3/5 w-3/5" aria-hidden>
        <circle cx="60" cy="60" r="50" fill="#E8842A" opacity="0.18" />
        <circle cx="60" cy="60" r="42" fill="none" stroke="#E8842A" strokeWidth="2.5" strokeDasharray="4 6" />
        <circle cx="46" cy="52" r="6" fill="#C0432A" /><circle cx="70" cy="46" r="5" fill="#C0432A" /><circle cx="64" cy="72" r="6" fill="#C0432A" />
        <path d="M40 72c6-8 16-8 22 0-6 3-16 3-22 0Z" fill="#4E7A3A" />
      </svg>
    </div>
  );
}
