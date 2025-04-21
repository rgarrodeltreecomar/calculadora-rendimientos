import { publicImages, PublicImageKey } from "../utils/publicImages";
import { Producto } from '../interfaces/interfaces';

// ======================== CONSTANTS ========================
const INVALID_URL_PATTERNS = [
  'localhost',
  '127.0.0.1',
  'Microsoft.AspNetCore.Http.FormFile',
  'base64',
  'data:image',
  'undefined',
  'null',
  'example.com',
  'test.com',
];

const PRODUCT_IMAGE_MAPPING: Record<string, PublicImageKey> = {
  'tridex': 'tridex',
  'sertexime': 'sertexime',
  'novazime': 'novazime',
  'surgizime': 'surgizime',
  'aniosymex3': 'aniosymeX3',
  'aniosymex5': 'aniosymeX5',
  'dm3': 'dm3',
  'eclipse': 'eclipse',
} as const;

// ======================== UTILS ========================
/**
 * Checks if a URL is a valid image URL.
 * @param url - The URL to validate.
 * @returns `true` if valid, `false` otherwise.
 */
const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url?.trim()) return false;

  const normalizedUrl = url.trim().toLowerCase();

  // Check for invalid patterns
  if (INVALID_URL_PATTERNS.some(pattern => normalizedUrl.includes(pattern))) {
    return false;
  }

  // Check if it's a valid HTTP/HTTPS URL
  try {
    const { protocol } = new URL(normalizedUrl);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Normalizes a product name for consistent matching.
 * - Removes accents, spaces, and special chars.
 * - Converts to lowercase.
 * @param name - The product name to normalize.
 * @returns The normalized name.
 */
const normalizeProductName = (name: string): string => {
  if (!name) return '';

  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .replace(/\s+/g, '') // Remove spaces
    .replace(/[^a-z0-9]/g, ''); // Keep only alphanumeric
};

// ======================== EXPORTED FUNCTIONS ========================
/**
 * Gets the correct image URL for a product:
 * 1. Uses `product.foto` if it's a valid URL.
 * 2. Falls back to a default image based on product name.
 * @param product - The product object.
 * @returns A secure image URL (HTTPS or default).
 */
export const getProductImage = (product: Producto): string => {
  // Use the product's image if valid
  if (isValidImageUrl(product.foto)) {
    return product.foto!
      .replace(/^http:\/\//i, 'https://') // Force HTTPS
      .replace(/\s+/g, ''); // Remove whitespace
  }

  // Fallback to default image based on product name
  const normalizedName = normalizeProductName(product.nombre || '');
  const imageKey = PRODUCT_IMAGE_MAPPING[normalizedName] || 'defaultProduct';
  
  return publicImages[imageKey];
};

/**
 * Processes an array of products to ensure consistent image URLs.
 * - Replaces invalid URLs with defaults.
 * - Forces HTTPS where possible.
 * @param products - Array of products.
 * @returns A new array with processed images.
 */
export const processProductsImages = (products: Producto[]): Producto[] => {
  if (!Array.isArray(products)) return [];

  return products.map(product => ({
    ...product,
    foto: getProductImage(product), // Ensure every product has a valid image
  }));
};

// Optional: Helper to get a default image if needed
export const getDefaultProductImage = (): string => publicImages.defaultProduct;