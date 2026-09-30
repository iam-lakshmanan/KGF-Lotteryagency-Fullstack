// "use client";
// import React from 'react';
// import { useRouter } from 'next/navigation'; 
// import { ALL_IMAGES } from '@/app/data/ImageData';

// export default function ImageCard() {
//   const router = useRouter();

//   const handleNavigation = (id) => {
//     console.log("Attempting to navigate to ID:", id);
//     router.push(`/ImageViewPage/${id}`);
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen p-10">
//       <h1 className="text-4xl font-bold text-center mb-10 text-black">PHOTO GALLERY</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
//         {ALL_IMAGES.map((img) => (
//           <div 
//             key={img.id} 
//             onClick={() => handleNavigation(img.id)}
//             className="group cursor-pointer bg-white p-3 rounded-xl shadow-md hover:shadow-xl transition-all active:scale-95"
//           >
//             <div className="overflow-hidden rounded-lg">
//               <img 
//                 src={img.src} 
//                 alt={img.title} 
//                 className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
//               />
//             </div>
//             <p className="mt-4 font-bold text-center text-gray-800 uppercase pointer-events-none">
//               {img.title}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ImageCard() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch logic aligned with your backend controller
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error("Failed to fetch images");
        }

        // Backend returns: { success: true, count: X, data: [rows] }
        setImages(data.data || []);
      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleNavigation = (id) => {
    router.push(`/ImageViewPage/${id}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-black">PHOTO GALLERY</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {images.length > 0 ? (
          images.map((img) => (
            <div 
              key={img.id} 
              onClick={() => handleNavigation(img.id)}
              className="group cursor-pointer bg-white p-3 rounded-xl shadow-md hover:shadow-xl transition-all active:scale-95"
            >
              <div className="overflow-hidden rounded-lg bg-gray-200">
                <img 
                  src={img.image_url} 
                  alt={img.description} 
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.target.src = "/assets/placeholder.jpg"; }} 
                />
              </div>
              <p className="mt-4 font-bold text-center text-gray-800 uppercase pointer-events-none line-clamp-1">
                {img.description || "KGF Lottery Photo"}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500">
            No images found in the gallery.
          </div>
        )}
      </div>
    </div>
  );
}