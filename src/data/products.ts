// Sample product data - will be replaced with Supabase data
import type { Product, Category } from '@/types/database'

export const categories: Category[] = [
  {
    id: '1',
    name: 'Ski & Snowboard',
    slug: 'ski-snowboard',
    description: 'Professional ski jackets and snowboard apparel with waterproof and breathable technology',
    parentId: null,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
    order: 1,
  },
  {
    id: '2',
    name: 'Hunting & Outdoor',
    slug: 'hunting-outdoor',
    description: 'Camouflage hunting gear and outdoor apparel for all terrains',
    parentId: null,
    image: 'https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?w=800',
    order: 2,
  },
  {
    id: '3',
    name: 'Tactical & Workwear',
    slug: 'tactical-workwear',
    description: 'Durable tactical jackets and workwear for demanding environments',
    parentId: null,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    order: 3,
  },
  {
    id: '4',
    name: 'Down & Insulated',
    slug: 'down-insulated',
    description: 'Warm down jackets and insulated apparel for extreme cold',
    parentId: null,
    image: 'https://images.unsplash.com/photo-1542327897-d73f4005b533?w=800',
    order: 4,
  },
  {
    id: '5',
    name: 'Pants & Bibs',
    slug: 'pants-bibs',
    description: 'Waterproof snow pants and bib overalls',
    parentId: null,
    image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800',
    order: 5,
  },
]

export const products: Product[] = [
  // Ski & Snowboard
  {
    id: '1',
    name: 'Pro Mountain Ski Jacket',
    slug: 'pro-mountain-ski-jacket',
    description: `The Pro Mountain Ski Jacket is engineered for serious skiers who demand the best in protection and performance. Featuring our advanced 3-layer waterproof breathable membrane with fully taped seams, this jacket keeps you dry in the harshest conditions.

Key Features:
- 20,000mm waterproof rating with 15,000g/m² breathability
- Fully seam-sealed construction
- Removable powder skirt with elastic grip
- Underarm ventilation zippers
- Multiple interior and exterior pockets
- RECCO® reflector for safety
- Adjustable hood compatible with helmet

Perfect for resort skiing, backcountry adventures, and professional use.`,
    shortDescription: 'Professional 3-layer ski jacket with 20K waterproof rating',
    categoryId: '1',
    gender: 'unisex',
    featured: true,
    moq: 200,
    priceRangeMin: 45,
    priceRangeMax: 85,
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75f7846?w=800',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
    ],
    specs: {
      'Waterproof': '20,000mm',
      'Breathability': '15,000g/m²/24h',
      'Fabric': '3-Layer Nylon Oxford',
      'Lining': 'Polyester Mesh',
      'Insulation': 'None (Shell)',
      'Sealing': 'Fully Taped',
      'Hood': 'Adjustable, Helmet Compatible',
      'Pockets': '6 External, 3 Internal',
    },
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Red', hex: '#c41e3a' },
      { name: 'Orange', hex: '#ff6b35' },
      { name: 'Royal Blue', hex: '#4169e1' },
      { name: 'Green', hex: '#228b22' },
      { name: 'Yellow', hex: '#ffd700' },
      { name: 'White', hex: '#f5f5f5' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    status: 'active',
  },
  {
    id: '2',
    name: 'Freestyle Snowboard Jacket',
    slug: 'freestyle-snowboard-jacket',
    description: 'Designed for freestyle snowboarders who want style and function. Baggy fit with oversized pockets and bold color blocking options.',
    shortDescription: 'Baggy fit snowboard jacket with street style',
    categoryId: '1',
    gender: 'unisex',
    featured: true,
    moq: 200,
    priceRangeMin: 38,
    priceRangeMax: 72,
    images: [
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800',
    ],
    specs: {
      'Waterproof': '15,000mm',
      'Breathability': '10,000g/m²/24h',
      'Fabric': '2-Layer Polyester',
      'Insulation': '80g Body / 60g Sleeve',
      'Fit': 'Oversized / Baggy',
      'Pockets': 'Large Cargo Pockets',
    },
    colors: [
      { name: 'Black Camo', hex: '#2d2d2d' },
      { name: 'Ocean Blue', hex: '#006994' },
      { name: 'Forest Green', hex: '#228b22' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Mustard', hex: '#ffdb58' },
      { name: 'Lavender', hex: '#e6e6fa' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    status: 'active',
  },
  {
    id: '3',
    name: 'Lightweight Shell Jacket',
    slug: 'lightweight-shell-jacket',
    description: 'Ultralight shell jacket for spring skiing and layering. Packable design that fits in your backpack.',
    shortDescription: 'Packable lightweight shell for spring conditions',
    categoryId: '1',
    gender: 'women',
    featured: false,
    moq: 200,
    priceRangeMin: 28,
    priceRangeMax: 48,
    images: [
      'https://images.unsplash.com/photo-1542327897-d73f4005b533?w=800',
    ],
    specs: {
      'Waterproof': '10,000mm',
      'Breathability': '8,000g/m²/24h',
      'Fabric': 'Ripstop Nylon',
      'Weight': '280g',
      'Packable': 'Yes',
    },
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'White', hex: '#f5f5f5' },
      { name: 'Coral', hex: '#ff7f50' },
      { name: 'Teal', hex: '#008080' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    status: 'active',
  },
  // Hunting & Outdoor
  {
    id: '4',
    name: 'Tactical Hunting Jacket',
    slug: 'tactical-hunting-jacket',
    description: `Professional hunting jacket designed for serious hunters. Features advanced camouflage patterns and scent-blocking technology.

Key Features:
- Whisper-quiet brushed fabric
- Scent-blocking treatment
- Multiple ammo and gear pockets
- Blood-proof game pocket
- Removable hood with face mask
- Water-resistant coating

Available in multiple camouflage patterns including Realtree, Mossy Oak, and custom designs.`,
    shortDescription: 'Professional hunting jacket with scent-blocking technology',
    categoryId: '2',
    gender: 'men',
    featured: true,
    moq: 200,
    priceRangeMin: 42,
    priceRangeMax: 78,
    images: [
      'https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?w=800',
    ],
    specs: {
      'Fabric': 'Brushed Polyester Fleece',
      'Water Resistance': 'DWR Coating',
      'Camouflage': 'Realtree / Mossy Oak / Custom',
      'Scent Control': 'Yes',
      'Pockets': '8 Total',
      'Game Pocket': 'Blood-proof',
    },
    colors: [
      { name: 'Realtree Edge', hex: '#4a5d23' },
      { name: 'Mossy Oak', hex: '#3d4f1f' },
      { name: 'Sitka Subalpine', hex: '#5c6b4a' },
      { name: 'Camo Green', hex: '#355e3b' },
      { name: 'Brown Camo', hex: '#5c4033' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    status: 'active',
  },
  {
    id: '5',
    name: 'Insulated Hunting Bib',
    slug: 'insulated-hunting-bib',
    description: 'Warm and durable hunting bib for cold weather conditions. Full-length zipper and adjustable suspenders.',
    shortDescription: 'Insulated hunting bib for cold weather',
    categoryId: '2',
    gender: 'men',
    featured: false,
    moq: 200,
    priceRangeMin: 48,
    priceRangeMax: 88,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ],
    specs: {
      'Fabric': 'Quiet Polyester Shell',
      'Insulation': '150g Polyester',
      'Water Resistance': 'DWR Coating',
      'Suspenders': 'Adjustable Elastic',
      'Zippers': 'Full-length Leg',
    },
    colors: [
      { name: 'Realtree', hex: '#4a5d23' },
      { name: 'Mossy Oak', hex: '#3d4f1f' },
      { name: 'Solid Brown', hex: '#5c4033' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    status: 'active',
  },
  // Tactical & Workwear
  {
    id: '6',
    name: 'Tactical Softshell Jacket',
    slug: 'tactical-softshell-jacket',
    description: 'Multi-purpose tactical softshell for law enforcement and military. Features hidden pockets and loop panels for patches.',
    shortDescription: 'Professional tactical softshell jacket',
    categoryId: '3',
    gender: 'men',
    featured: true,
    moq: 200,
    priceRangeMin: 35,
    priceRangeMax: 65,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ],
    specs: {
      'Fabric': '4-Way Stretch Softshell',
      'Waterproof': '10,000mm',
      'Breathability': '8,000g/m²',
      'Loop Panels': 'Shoulder and Chest',
      'Hidden Pockets': '2',
      'Badge Tab': 'Yes',
    },
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Olive Drab', hex: '#6b8e23' },
      { name: 'Coyote Brown', hex: '#81613c' },
      { name: 'Ranger Green', hex: '#4a5d23' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    status: 'active',
  },
  {
    id: '7',
    name: 'Industrial Work Jacket',
    slug: 'industrial-work-jacket',
    description: 'Heavy-duty work jacket for construction and industrial use. Reinforced elbows and multiple tool pockets.',
    shortDescription: 'Heavy-duty industrial work jacket',
    categoryId: '3',
    gender: 'unisex',
    featured: false,
    moq: 200,
    priceRangeMin: 32,
    priceRangeMax: 55,
    images: [
      'https://images.unsplash.com/photo-1542327897-d73f4005b533?w=800',
    ],
    specs: {
      'Fabric': 'Heavy-duty Cotton Canvas',
      'Water Resistance': 'Water-repellent',
      'Reinforcement': 'Elbow Patches',
      'Pockets': 'Tool and Phone Pockets',
      'Closure': 'Heavy-duty Zipper',
    },
    colors: [
      { name: 'Carhartt Brown', hex: '#5c4033' },
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Khaki', hex: '#c3b091' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    status: 'active',
  },
  // Down & Insulated
  {
    id: '8',
    name: 'Premium Down Jacket',
    slug: 'premium-down-jacket',
    description: 'Ultra-warm down jacket with 90% white duck down fill. Lightweight and packable design for extreme cold.',
    shortDescription: '90% down fill jacket for extreme cold',
    categoryId: '4',
    gender: 'unisex',
    featured: true,
    moq: 200,
    priceRangeMin: 55,
    priceRangeMax: 95,
    images: [
      'https://images.unsplash.com/photo-1542327897-d73f4005b533?w=800',
    ],
    specs: {
      'Fill': '90% White Duck Down',
      'Fill Power': '700FP',
      'Shell': '20D Nylon Ripstop',
      'Temperature': '-20°C to -30°C',
      'Weight': '450g (Size M)',
      'Packable': 'Included Stuff Sack',
    },
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Olive', hex: '#6b8e23' },
      { name: 'Wine Red', hex: '#722f37' },
      { name: 'Royal Blue', hex: '#4169e1' },
      { name: 'Orange', hex: '#ff6b35' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    status: 'active',
  },
  {
    id: '9',
    name: 'Synthetic Puffer Jacket',
    slug: 'synthetic-puffer-jacket',
    description: 'Vegan-friendly synthetic puffer with recycled insulation. Water-resistant and quick-drying.',
    shortDescription: 'Vegan synthetic puffer jacket',
    categoryId: '4',
    gender: 'women',
    featured: false,
    moq: 200,
    priceRangeMin: 38,
    priceRangeMax: 68,
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75f7846?w=800',
    ],
    specs: {
      'Insulation': 'Recycled Polyester (100g)',
      'Shell': 'Recycled Nylon',
      'Water Resistance': 'DWR Coating',
      'Temperature': '-10°C to -20°C',
      'Care': 'Machine Washable',
    },
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Cream', hex: '#fffdd0' },
      { name: 'Dusty Pink', hex: '#dcaea9' },
      { name: 'Sage Green', hex: '#9dc183' },
      { name: 'Navy', hex: '#1e3a5f' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    status: 'active',
  },
  // Pants & Bibs
  {
    id: '10',
    name: 'Pro Ski Pants',
    slug: 'pro-ski-pants',
    description: 'Technical ski pants with articulated knees and reinforced scuff guards. Compatible with all ski boots.',
    shortDescription: 'Technical ski pants with full sealing',
    categoryId: '5',
    gender: 'unisex',
    featured: true,
    moq: 200,
    priceRangeMin: 38,
    priceRangeMax: 72,
    images: [
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800',
    ],
    specs: {
      'Waterproof': '20,000mm',
      'Breathability': '15,000g/m²',
      'Fabric': '3-Layer Nylon Oxford',
      'Waist': 'Adjustable with Belt Loops',
      'Ventilation': 'Inner Thigh Zips',
      'Reinforcement': 'Scuff Guards',
    },
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Red', hex: '#c41e3a' },
      { name: 'Royal Blue', hex: '#4169e1' },
      { name: 'Green', hex: '#228b22' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    status: 'active',
  },
  {
    id: '11',
    name: 'Insulated Snow Bib',
    slug: 'insulated-snow-bib',
    description: 'Warm insulated snow bib with adjustable suspenders. Perfect for cold days on the mountain.',
    shortDescription: 'Insulated snow bib with suspenders',
    categoryId: '5',
    gender: 'unisex',
    featured: false,
    moq: 200,
    priceRangeMin: 45,
    priceRangeMax: 82,
    images: [
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800',
    ],
    specs: {
      'Waterproof': '15,000mm',
      'Insulation': '100g Polyester',
      'Fabric': '2-Layer Polyester',
      'Suspenders': 'Adjustable Elastic',
      'Chest Pocket': 'Zippered',
      'Leg Zippers': 'Full-length',
    },
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Olive', hex: '#6b8e23' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    status: 'active',
  },
  {
    id: '12',
    name: 'Cargo Snow Pants',
    slug: 'cargo-snow-pants',
    description: 'Baggy cargo-style snow pants with oversized pockets. Popular for freestyle and street riding.',
    shortDescription: 'Baggy cargo snow pants',
    categoryId: '5',
    gender: 'unisex',
    featured: false,
    moq: 200,
    priceRangeMin: 35,
    priceRangeMax: 65,
    images: [
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800',
    ],
    specs: {
      'Waterproof': '10,000mm',
      'Breathability': '8,000g/m²',
      'Fit': 'Oversized / Baggy',
      'Pockets': 'Large Cargo Pockets',
      'Vents': 'Mesh-lined',
    },
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Khaki', hex: '#c3b091' },
      { name: 'Olive', hex: '#6b8e23' },
      { name: 'Navy', hex: '#1e3a5f' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    status: 'active',
  },
]

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = categories.find(c => c.slug === categorySlug)
  if (!category) return []
  return products.filter(p => p.categoryId === category.id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug)
}
