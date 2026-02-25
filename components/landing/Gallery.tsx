"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";

interface GalleryImage {
  id: number;
  url: string;
  caption: string | null;
  category: string | null;
}

/* ── 20 unique floating positions for the scattered gallery ── */
const GALLERY_POSITIONS = [
  { top: "2%", left: "3%", size: "w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44", rot: -6, delay: 0 },
  { top: "5%", left: "30%", size: "w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40", rot: 4, delay: 0.2 },
  { top: "3%", right: "25%", size: "w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36", rot: -3, delay: 0.4 },
  { top: "8%", right: "3%", size: "w-26 h-26 sm:w-34 sm:h-34 md:w-42 md:h-42", rot: 5, delay: 0.1 },
  { top: "28%", left: "1%", size: "w-22 h-22 sm:w-30 sm:h-30 md:w-36 md:h-36", rot: -4, delay: 0.6 },
  { top: "25%", left: "22%", size: "w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48", rot: 2, delay: 0.3 },
  { top: "22%", right: "18%", size: "w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40", rot: -5, delay: 0.5 },
  { top: "30%", right: "1%", size: "w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36", rot: 3, delay: 0.7 },
  { top: "50%", left: "5%", size: "w-24 h-24 sm:w-32 sm:h-32 md:w-38 md:h-38", rot: -2, delay: 0.4 },
  { top: "48%", left: "28%", size: "w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36", rot: 6, delay: 0.8 },
  { top: "52%", right: "22%", size: "w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44", rot: -4, delay: 0.2 },
  { top: "46%", right: "2%", size: "w-22 h-22 sm:w-30 sm:h-30 md:w-36 md:h-36", rot: 3, delay: 0.6 },
  { top: "70%", left: "2%", size: "w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36", rot: 5, delay: 0.3 },
  { top: "68%", left: "25%", size: "w-26 h-26 sm:w-34 sm:h-34 md:w-42 md:h-42", rot: -3, delay: 0.5 },
  { top: "72%", right: "20%", size: "w-24 h-24 sm:w-32 sm:h-32 md:w-38 md:h-38", rot: 4, delay: 0.7 },
  { top: "66%", right: "1%", size: "w-22 h-22 sm:w-28 sm:h-28 md:w-36 md:h-36", rot: -6, delay: 0.1 },
  { top: "88%", left: "8%", size: "w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40", rot: 2, delay: 0.4 },
  { top: "85%", left: "32%", size: "w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36", rot: -5, delay: 0.6 },
  { top: "90%", right: "25%", size: "w-26 h-26 sm:w-34 sm:h-34 md:w-40 md:h-40", rot: 3, delay: 0.8 },
  { top: "86%", right: "4%", size: "w-22 h-22 sm:w-30 sm:h-30 md:w-38 md:h-38", rot: -2, delay: 0.2 },
];

/* ── Unique float paths so each image moves differently ── */
const FLOAT_PATHS = [
  { y: [0, -12, 6, -8, 0], x: [0, 8, -4, 6, 0], rotate: [0, 3, -2, 4, 0] },
  { y: [0, 10, -14, 8, 0], x: [0, -6, 10, -8, 0], rotate: [0, -4, 3, -2, 0] },
  { y: [0, -8, 12, -6, 0], x: [0, 10, -6, 4, 0], rotate: [0, 5, -3, 2, 0] },
  { y: [0, 14, -8, 10, 0], x: [0, -8, 6, -10, 0], rotate: [0, -3, 5, -4, 0] },
  { y: [0, -10, 8, -12, 0], x: [0, 6, -10, 8, 0], rotate: [0, 4, -6, 3, 0] },
  { y: [0, 8, -10, 6, 0], x: [0, -10, 8, -6, 0], rotate: [0, -5, 4, -3, 0] },
  { y: [0, -14, 10, -8, 0], x: [0, 12, -8, 6, 0], rotate: [0, 6, -4, 5, 0] },
  { y: [0, 12, -6, 10, 0], x: [0, -4, 12, -8, 0], rotate: [0, -2, 6, -5, 0] },
];

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setImages(data);
      })
      .catch(() => {});
  }, []);

  // Duplicate images to fill 20 positions if fewer than 20
  const displayImages = useMemo(() => {
    if (images.length === 0) return [];
    const result: GalleryImage[] = [];
    for (let i = 0; i < Math.min(20, Math.max(images.length, 12)); i++) {
      result.push(images[i % images.length]);
    }
    return result;
  }, [images]);

  if (images.length === 0) return null;

  return (
    <>
      <section
        ref={ref}
        className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-emerald-50/30"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50/30 rounded-full blur-3xl" />
        </div>

        {/* Section Header */}
        <div className="relative z-20 text-center mb-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-100 mb-4"
          >
            <Camera className="w-4 h-4" />
            Our Gallery
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900"
          >
            Moments of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Impact
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-gray-500 max-w-xl mx-auto text-base md:text-lg"
          >
            A glimpse into the lives we&apos;ve touched and the communities we&apos;ve built together.
          </motion.p>
        </div>

        {/* Floating Images Container */}
        <div className="relative z-10 w-full" style={{ height: "clamp(600px, 120vw, 1100px)" }}>
          {displayImages.map((img, i) => {
            const pos = GALLERY_POSITIONS[i % GALLERY_POSITIONS.length];
            const floatPath = FLOAT_PATHS[i % FLOAT_PATHS.length];
            const duration = 7 + (i % 5) * 1.2;

            const posStyle: React.CSSProperties = { position: "absolute" };
            if (pos.top) posStyle.top = pos.top;
            if (pos.left) posStyle.left = pos.left;
            if (pos.right) posStyle.right = pos.right;

            return (
              <motion.div
                key={`gallery-${img.id}-${i}`}
                className={`${pos.size} rounded-2xl overflow-hidden shadow-xl shadow-black/10 cursor-pointer group`}
                style={posStyle}
                initial={{ opacity: 0, scale: 0.5, rotate: pos.rot * 2 }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        scale: 1,
                        y: floatPath.y,
                        x: floatPath.x,
                        rotate: floatPath.rotate.map((r: number) => r + pos.rot),
                      }
                    : {}
                }
                transition={{
                  opacity: { duration: 0.8, delay: pos.delay + i * 0.05 },
                  scale: { duration: 0.8, delay: pos.delay + i * 0.05 },
                  y: { duration, repeat: Infinity, ease: "easeInOut", delay: pos.delay },
                  x: { duration: duration + 1, repeat: Infinity, ease: "easeInOut", delay: pos.delay },
                  rotate: { duration: duration + 2, repeat: Infinity, ease: "easeInOut", delay: pos.delay },
                }}
                whileHover={{ scale: 1.08, zIndex: 50, rotate: 0 }}
                onClick={() => setSelectedImage(img)}
              >
                <div className="relative w-full h-full overflow-hidden rounded-2xl border-2 border-white/60 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.caption || "Gallery image"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    {img.caption && (
                      <p className="text-white text-xs sm:text-sm font-medium line-clamp-2 drop-shadow-lg">
                        {img.caption}
                      </p>
                    )}
                  </div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>
            );
          })}

          {/* Sparkle decorations */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute z-0 text-emerald-300/40"
              style={{
                top: `${15 + i * 14}%`,
                left: `${10 + (i % 3) * 35}%`,
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative max-w-4xl max-h-[85vh] w-full cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.url}
              alt={selectedImage.caption || "Gallery image"}
              className="w-full h-full max-h-[80vh] object-contain rounded-2xl"
            />
            {selectedImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl p-6">
                <p className="text-white text-lg font-medium">{selectedImage.caption}</p>
                {selectedImage.category && (
                  <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                    {selectedImage.category}
                  </span>
                )}
              </div>
            )}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors text-xl"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
