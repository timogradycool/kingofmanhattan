import rawCategories from '../../content/categories.json';

export type PaletteColor = 'red' | 'blue' | 'yellow' | 'green' | 'orange';

export interface Category {
  slug: string;
  name: string;
  emoji: string;
  /** One of the logo colors (red, blue, yellow, green, orange) or any CSS color like "#8e44ad". */
  color: PaletteColor | string;
  blurb?: string;
}

export const categories: Category[] = rawCategories;

export const categorySlugs = categories.map((c) => c.slug);

export function getCategory(slug: string): Category {
  const category = categories.find((c) => c.slug === slug);
  if (!category) throw new Error(`Unknown category "${slug}". Check content/categories.json.`);
  return category;
}

const palette: Record<PaletteColor, string> = {
  red: 'var(--color-chomp-red)',
  blue: 'var(--color-chomp-blue)',
  yellow: 'var(--color-chomp-yellow)',
  green: 'var(--color-chomp-green)',
  orange: 'var(--color-chomp-orange)',
};

/** CSS color value for a category, usable in inline styles. */
export function categoryColor(category: Category): string {
  return palette[category.color as PaletteColor] ?? category.color;
}

/** Inline style that exposes the category color as --cat for child elements. */
export function categoryStyle(category: Category): string {
  return `--cat: ${categoryColor(category)};`;
}
