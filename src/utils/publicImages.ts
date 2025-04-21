export const publicImages = {
  tridex: '/tridex.jpg',
  sertexime: '/sertexmine.jpg', 
  novazime: '/NOVAZIME.jpg',  
  surgizime: '/surgizime.jpg',
  aniosymeX3: '/Aniosyme-X3.webp',
  aniosymeX5: '/Aniosyme_5_.jpg',  
  dm3: '/DM3.webp',
  eclipse: '/eclipse.webp',
  defaultProduct: '/logo-1-1.png',
  vite: '/vite.svg' 
} as const;

export type PublicImageKey = keyof typeof publicImages;