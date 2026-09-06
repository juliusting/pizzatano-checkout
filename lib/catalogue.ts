/**
 * Pizzatano menu — the single catalogue the grid and the cart read from.
 * PRICES: null = not yet confirmed by Pizzatano (they aren't published on IG).
 * Fill in `price` per variant before go-live; totals switch on automatically.
 */
export interface Variant { key: string; label: string; price: number | null; }
export interface Product {
  id: string;
  slug: string;
  name: string;
  italian?: string;
  description: string;
  tags: string[];
  /** Real product photo from their reels, or null (branded tile is shown). */
  image: string | null;
  variants: Variant[];
  badge?: string;
}

const regular = (price: number | null = null): Variant[] => [{ key: "regular", label: "Regular", price }];

export const PRODUCTS: Product[] = [
  {
    id: "margherita", slug: "margherita", name: "Margherita", italian: "La classica",
    description: "San Marzano tomato, D.O.P white buffalo mozzarella, fresh basil, extra-virgin olive oil.",
    tags: ["Vegetarian"], image: null, variants: regular(), badge: "Classic",
  },
  {
    id: "marinara", slug: "marinara", name: "Marinara",
    description: "Tomato, garlic, oregano and olive oil on a leopard-spotted Neapolitan crust. No cheese, all flavour.",
    tags: ["Vegan"], image: null, variants: regular(),
  },
  {
    id: "napoli", slug: "napoli", name: "Napoli",
    description: "Tomato, mozzarella, anchovies, capers and oregano. Salty, briny, unmistakably Naples.",
    tags: ["Seafood"], image: null, variants: regular(),
  },
  {
    id: "quattro-formaggi", slug: "quattro-formaggi", name: "Quattro Formaggi", italian: "Four cheese",
    description: "Fior di latte and three more cheeses melted over a blistered base, finished with basil.",
    tags: ["Vegetarian", "Cheese lovers"], image: "/images/menu/Dc4_cOSTesA.jpg", variants: regular(), badge: "Popular",
  },
  {
    id: "diavola", slug: "diavola", name: "Diavola", italian: "The spicy one",
    description: "Tomato, mozzarella and Italian beef salami with basil, straight from the wood fire.",
    tags: ["Spicy", "Beef"], image: "/images/menu/Dc4-ycEzFYa.jpg", variants: regular(), badge: "Popular",
  },
];

export const getProductById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const priceFor = (p: Product, variantKey: string): number | null =>
  p.variants.find((v) => v.key === variantKey)?.price ?? null;
/** Single-variant products show no "(Regular)" suffix in the cart/message. */
export const variantLabel = (p: Product, variantKey: string): string | null =>
  p.variants.length > 1 ? (p.variants.find((v) => v.key === variantKey)?.label ?? null) : null;
export const anyPriceUnconfirmed = () => PRODUCTS.some((p) => p.variants.some((v) => v.price == null));
