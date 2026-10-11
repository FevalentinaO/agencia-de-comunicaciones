// Photos for the Trayectoria gallery. Replace the files in
// /public/images/trayectoria/ (1.jpg ... 14.jpg) with your own, or change the
// count / list any path or URL here.
export const TRAYECTORIA_COUNT = 14;

export const TRAYECTORIA_IMAGES = Array.from(
  { length: TRAYECTORIA_COUNT },
  (_, i) => ({
    src: `/images/trayectoria/${i + 1}.jpg`,
    alt: `Trayectoria, imagen ${i + 1}`,
  })
);

// Items for the bento gallery (Propuesta 2). `span` controls each tile's size
// in the grid. Titles and descriptions are placeholders: replace freely.
export const BENTO_ITEMS = [
  { id: 1, title: "Momento 1", desc: "Un instante de la trayectoria.", url: "/images/trayectoria/1.jpg", span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2" },
  { id: 2, title: "Momento 2", desc: "Un instante de la trayectoria.", url: "/images/trayectoria/2.jpg", span: "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2" },
  { id: 3, title: "Momento 3", desc: "Un instante de la trayectoria.", url: "/images/trayectoria/3.jpg", span: "md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-2" },
  { id: 4, title: "Momento 4", desc: "Un instante de la trayectoria.", url: "/images/trayectoria/4.jpg", span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2" },
  { id: 5, title: "Momento 5", desc: "Un instante de la trayectoria.", url: "/images/trayectoria/5.jpg", span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2" },
  { id: 6, title: "Momento 6", desc: "Un instante de la trayectoria.", url: "/images/trayectoria/6.jpg", span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2" },
  { id: 7, title: "Momento 7", desc: "Un instante de la trayectoria.", url: "/images/trayectoria/7.jpg", span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2" },
];
