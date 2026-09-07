import type { TileKind } from "@/lib/catalogue";

/**
 * Product image, or an appetite-forward illustrated top-down pizza when there's
 * no real photo yet (we never borrow another dish's photo). Portrait reel stills
 * are cropped square via object-cover; pizzas sit centre-frame so this reads well.
 */

// Deterministic scatter so a given kind always draws the same way.
function scatter(seed: number, n: number, rMax: number): [number, number][] {
  const out: [number, number][] = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const ang = (s / 233280) * Math.PI * 2;
    s = (s * 9301 + 49297) % 233280;
    const rad = 14 + (s / 233280) * rMax;
    out.push([100 + Math.cos(ang) * rad, 100 + Math.sin(ang) * rad]);
  }
  return out;
}

function IllustratedPizza({ kind }: { kind: TileKind }) {
  const cheese = kind === "marinara" ? "#C8532E" : "#F0D48A"; // marinara has no cheese: red base shows
  const sauce = "#B23A22";
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label={`${kind} pizza illustration`}>
      <rect width="200" height="200" fill="#2E211B" />
      {/* charred crust */}
      <circle cx="100" cy="100" r="92" fill="#C98A44" />
      <circle cx="100" cy="100" r="92" fill="none" stroke="#7A4A22" strokeWidth="3" opacity="0.5" />
      {scatter(kind.length * 7 + 3, 16, 84).filter(([, y]) => Math.hypot(100 - 100, y - 100)).map(([x, y], i) => {
        const ang = (i / 16) * Math.PI * 2;
        return <ellipse key={i} cx={100 + Math.cos(ang) * 86} cy={100 + Math.sin(ang) * 86} rx="6" ry="4" fill="#3B2412" opacity="0.55" transform={`rotate(${(ang * 180) / Math.PI} ${100 + Math.cos(ang) * 86} ${100 + Math.sin(ang) * 86})`} />;
      })}
      {/* sauce / cheese base */}
      <circle cx="100" cy="100" r="78" fill={sauce} />
      {kind !== "marinara" && <circle cx="100" cy="100" r="78" fill={cheese} opacity="0.92" />}
      {/* melty cheese pooling (not marinara) */}
      {kind !== "marinara" && scatter(11, 10, 66).map(([x, y], i) => (
        <circle key={`c${i}`} cx={x} cy={y} r={5 + (i % 3)} fill="#F7E4A6" opacity="0.7" />
      ))}

      {/* toppings per style */}
      {kind === "margherita" && scatter(21, 9, 60).map(([x, y], i) => (
        <g key={`m${i}`}>
          <circle cx={x} cy={y} r="7" fill="#FBF3DE" />
          <path d={`M${x - 9} ${y + 9} q9 -12 18 0 q-9 6 -18 0Z`} fill="#4E7A3A" transform={`rotate(${i * 40} ${x} ${y})`} />
        </g>
      ))}
      {kind === "napoli" && (
        <>
          {scatter(31, 6, 58).map(([x, y], i) => <circle key={`t${i}`} cx={x} cy={y} r="6" fill="#C0392A" />)}
          {scatter(37, 6, 56).map(([x, y], i) => <rect key={`a${i}`} x={x - 8} y={y - 2.5} width="16" height="5" rx="2.5" fill="#8A6A44" transform={`rotate(${i * 55} ${x} ${y})`} />)}
          {scatter(41, 8, 60).map(([x, y], i) => <circle key={`cap${i}`} cx={x} cy={y} r="3" fill="#3E5F2C" />)}
        </>
      )}
      {kind === "marinara" && (
        <>
          {scatter(53, 9, 58).map(([x, y], i) => <ellipse key={`g${i}`} cx={x} cy={y} rx="5" ry="3.5" fill="#EED9A6" transform={`rotate(${i * 40} ${x} ${y})`} />)}
          {scatter(59, 20, 66).map(([x, y], i) => <circle key={`o${i}`} cx={x} cy={y} r="1.6" fill="#3E5F2C" />)}
        </>
      )}
      {(kind === "quattro" || kind === "diavola") && scatter(kind === "diavola" ? 71 : 67, kind === "diavola" ? 9 : 7, 60).map(([x, y], i) => (
        kind === "diavola"
          ? <circle key={`d${i}`} cx={x} cy={y} r="8" fill="#B23A2A" />
          : <circle key={`q${i}`} cx={x} cy={y} r="7" fill="#FBEFC9" opacity="0.9" />
      ))}
      {/* a couple of basil leaves on top for freshness */}
      {kind !== "marinara" && [[70, 78], [128, 120]].map(([x, y], i) => (
        <path key={`b${i}`} d={`M${x - 8} ${y + 8} q8 -13 16 0 q-8 6 -16 0Z`} fill="#4E7A3A" transform={`rotate(${i * 70} ${x} ${y})`} />
      ))}
    </svg>
  );
}

export default function PizzaTile({ image, name, kind = "margherita", eager = false }: { image: string | null; name: string; kind?: TileKind; eager?: boolean }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={name} loading={eager ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover" style={{ aspectRatio: "1/1" }} />;
  }
  return <div className="h-full w-full" style={{ aspectRatio: "1/1" }} aria-label={`${name} (photo coming soon)`}><IllustratedPizza kind={kind} /></div>;
}
