"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export interface BentoItem {
  id: number;
  title: string;
  desc: string;
  url: string;
  span: string;
}

function Photo({
  item,
  className,
  sizes,
  contain,
}: {
  item: BentoItem;
  className?: string;
  sizes: string;
  contain?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <Image
        src={item.url}
        alt={item.title}
        fill
        sizes={sizes}
        draggable={false}
        className={contain ? "object-contain" : "object-cover"}
      />
    </div>
  );
}

function GalleryModal({
  selectedItem,
  onClose,
  setSelectedItem,
  items,
}: {
  selectedItem: BentoItem;
  onClose: () => void;
  setSelectedItem: (item: BentoItem) => void;
  items: BentoItem[];
}) {
  const [dock, setDock] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={selectedItem.title}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-(--marfil)/92 p-3 backdrop-blur-lg sm:p-6"
        onClick={onClose}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedItem.id}
            className="relative aspect-[16/9] h-auto max-h-[70vh] w-full max-w-[95%] overflow-hidden border border-(--bruma) sm:max-w-[85%] md:max-w-3xl"
            initial={{ y: 20, scale: 0.97, opacity: 0 }}
            animate={{
              y: 0,
              scale: 1,
              opacity: 1,
              transition: { type: "spring", stiffness: 500, damping: 30, mass: 0.5 },
            }}
            exit={{ y: 20, scale: 0.97, opacity: 0, transition: { duration: 0.15 } }}
          >
            <Photo
              item={selectedItem}
              contain
              sizes="(min-width: 768px) 48rem, 95vw"
              className="h-full w-full bg-[#dedbe6]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3 md:p-4">
              <h3 className="text-base font-semibold text-white md:text-xl">
                {selectedItem.title}
              </h3>
              <p className="mt-1 text-sm text-white/85">{selectedItem.desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          aria-label="Cerrar"
          className="btn btn-ghost absolute top-3 right-3 h-11 w-11 p-0! sm:top-5 sm:right-5"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </motion.div>

      {/* Draggable dock with thumbnails */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        initial={false}
        animate={{ x: dock.x, y: dock.y }}
        onDragEnd={(_, info) =>
          setDock((prev) => ({ x: prev.x + info.offset.x, y: prev.y + info.offset.y }))
        }
        className="fixed bottom-4 left-1/2 z-[70] -translate-x-1/2 touch-none"
      >
        <div className="cursor-grab border border-(--bruma) bg-(--marfil) active:cursor-grabbing">
          <div className="flex items-center -space-x-2 px-3 py-2">
            {items.map((item, index) => {
              const active = selectedItem.id === item.id;
              return (
                <motion.button
                  type="button"
                  key={item.id}
                  aria-label={item.title}
                  aria-current={active}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedItem(item);
                  }}
                  style={{ zIndex: active ? 30 : items.length - index }}
                  className={`relative h-9 w-9 flex-shrink-0 overflow-hidden hover:z-20 sm:h-10 sm:w-10 ${
                    active
                      ? "ring-2 ring-(--luz)"
                      : "hover:ring-2 hover:ring-(--text)/40"
                  }`}
                  initial={{ rotate: index % 2 === 0 ? -15 : 15 }}
                  animate={{
                    scale: active ? 1.2 : 1,
                    rotate: active ? 0 : index % 2 === 0 ? -15 : 15,
                    y: active ? -8 : 0,
                  }}
                  whileHover={{
                    scale: 1.3,
                    rotate: 0,
                    y: -10,
                    transition: { type: "spring", stiffness: 400, damping: 25 },
                  }}
                >
                  <Photo item={item} sizes="40px" className="h-full w-full" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function InteractiveBentoGallery({
  mediaItems,
  title,
  description,
}: {
  mediaItems: BentoItem[];
  title?: string;
  description?: string;
}) {
  const [selectedItem, setSelectedItem] = useState<BentoItem | null>(null);
  const [items, setItems] = useState(mediaItems);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && (
            <h2 className="display text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-2 text-base text-(--text)">{description}</p>
          )}
        </div>
      )}

      <motion.div
        className="grid auto-rows-[60px] grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            role="button"
            tabIndex={0}
            aria-label={`Abrir ${item.title}`}
            className={`group relative cursor-grab overflow-hidden active:cursor-grabbing ${item.span}`}
            onClick={() => !isDragging && setSelectedItem(item)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedItem(item);
              }
            }}
            variants={{
              hidden: { y: 50, scale: 0.9, opacity: 0 },
              visible: {
                y: 0,
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                  delay: index * 0.05,
                },
              },
            }}
            whileHover={{ scale: 1.02 }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(_, info) => {
              window.setTimeout(() => setIsDragging(false), 0);
              const moveDistance = info.offset.x + info.offset.y;
              if (Math.abs(moveDistance) > 50) {
                const next = [...items];
                const [dragged] = next.splice(index, 1);
                const target =
                  moveDistance > 0
                    ? Math.min(index + 1, items.length)
                    : Math.max(index - 1, 0);
                next.splice(target, 0, dragged);
                setItems(next);
              }
            }}
          >
            <Photo
              item={item}
              sizes="(min-width: 768px) 25vw, 50vw"
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/25 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              <h3 className="line-clamp-1 text-sm font-medium text-white">
                {item.title}
              </h3>
              <p className="mt-0.5 line-clamp-2 text-xs text-white/80">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <GalleryModal
            selectedItem={selectedItem}
            onClose={() => setSelectedItem(null)}
            setSelectedItem={setSelectedItem}
            items={items}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
