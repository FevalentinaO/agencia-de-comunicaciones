export type GalleryImage = { src: string; alt: string };

export type Pin = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  images: GalleryImage[];
};

// Each pin reads its photos from /public/images/galerias/<id>/1.jpg, 2.jpg...
// To use your own: drop files with those names in that folder (or change the
// count), or list any path/URL in `images` directly.
function folder(id: string, count: number, name: string): GalleryImage[] {
  return Array.from({ length: count }, (_, i) => ({
    src: `/images/galerias/${id}/${i + 1}.jpg`,
    alt: `${name}, imagen ${i + 1}`,
  }));
}

export const PINS: Pin[] = [
  {
    id: "bogota",
    name: "Bogotá",
    lat: 4.71,
    lng: -74.07,
    description: "Una muestra de lo que hacemos en Bogotá.",
    images: folder("bogota", 5, "Bogotá"),
  },
  {
    id: "ciudad-de-mexico",
    name: "Ciudad de México",
    lat: 19.43,
    lng: -99.13,
    description: "Una muestra de lo que hacemos en Ciudad de México.",
    images: folder("ciudad-de-mexico", 5, "Ciudad de México"),
  },
  {
    id: "nueva-york",
    name: "Nueva York",
    lat: 40.71,
    lng: -74.0,
    description: "Una muestra de lo que hacemos en Nueva York.",
    images: folder("nueva-york", 5, "Nueva York"),
  },
  {
    id: "madrid",
    name: "Madrid",
    lat: 40.42,
    lng: -3.7,
    description: "Una muestra de lo que hacemos en Madrid.",
    images: folder("madrid", 5, "Madrid"),
  },
  {
    id: "buenos-aires",
    name: "Buenos Aires",
    lat: -34.6,
    lng: -58.38,
    description: "Una muestra de lo que hacemos en Buenos Aires.",
    images: folder("buenos-aires", 5, "Buenos Aires"),
  },
];
