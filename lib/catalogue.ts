/**
 * Pizzatano menu — the single catalogue the grid and the cart read from.
 * PRICES: null = not yet confirmed by Pizzatano (they aren't published on IG).
 * Fill in `price` per variant before go-live; totals switch on automatically.
 *
 * Order note: the two pizzas with REAL reel photos (Diavola, Quattro Formaggi)
 * lead the first row; the three without a photo use an appetite-forward
 * per-style illustrated tile (see components/PizzaTile.tsx) rather than a
 * borrowed photo.
 */
export type TileKind = "margherita" | "marinara" | "napoli" | "quattro" | "diavola";

export interface Variant { key: string; label: string; price: number | null; }
export interface Product {
  id: string;
  slug: string;
  name: string;
  italian?: string;
  description: string;
  tags: string[];
  /** Real product photo from their reels, or null (illustrated tile is shown). */
  image: string | null;
  /** Which illustrated pizza to draw when there is no photo. */
  tile: TileKind;
  variants: Variant[];
  badge?: string;
}

const regular = (price: number | null = null): Variant[] => [{ key: "regular", label: "Regular", price }];

export const PRODUCTS: Product[] = [
  {
    id: "margherita", slug: "margherita", name: "Margherita", italian: "La classica",
    description: "San Marzano tomato, D.O.P white buffalo mozzarella, fresh basil, extra-virgin olive oil.",
    tags: ["Vegetarian"], image: "/images/menu/margherita.jpg", tile: "margherita", variants: regular(), badge: "The classic",
  },
  {
    id: "diavola", slug: "diavola", name: "Diavola", italian: "The spicy one",
    description: "Tomato, mozzarella and Italian beef salami with basil, straight from the wood fire.",
    tags: ["Spicy", "Beef"], image: "/images/menu/Dc4-ycEzFYa.jpg", tile: "diavola", variants: regular(), badge: "Most loved",
  },
  {
    id: "quattro-formaggi", slug: "quattro-formaggi", name: "Quattro Formaggi", italian: "Four cheese",
    description: "Fior di latte and three more cheeses melted over a blistered base, finished with basil.",
    tags: ["Vegetarian", "Cheese lovers"], image: "/images/menu/Dc4_cOSTesA.jpg", tile: "quattro", variants: regular(), badge: "Most loved",
  },
  {
    id: "marinara", slug: "marinara", name: "Marinara",
    description: "Tomato, garlic, oregano and olive oil on a leopard-spotted Neapolitan crust. No cheese, all flavour.",
    tags: ["Vegan"], image: "/images/menu/marinara.jpg", tile: "marinara", variants: regular(),
  },
  {
    id: "napoli", slug: "napoli", name: "Napoli",
    description: "Tomato, mozzarella, anchovies, capers and oregano. Salty, briny, unmistakably Naples.",
    tags: ["Seafood"], image: null, tile: "napoli", variants: regular(),
  },
];

export const getProductById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const priceFor = (p: Product, variantKey: string): number | null =>
  p.variants.find((v) => v.key === variantKey)?.price ?? null;
/** Single-variant products show no "(Regular)" suffix in the cart/message. */
export const variantLabel = (p: Product, variantKey: string): string | null =>
  p.variants.length > 1 ? (p.variants.find((v) => v.key === variantKey)?.label ?? null) : null;
export const anyPriceUnconfirmed = () => PRODUCTS.some((p) => p.variants.some((v) => v.price == null));
