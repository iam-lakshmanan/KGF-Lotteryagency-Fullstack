"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ImageViewPage({ params }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  // State for dynamic data
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();

        if (res.ok && result.success) {
          setImages(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching images for view page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Use String() comparison to ensure the ID from params matches the DB ID
  const currentImg = images.find((img) => String(img.id) === String(id));
  const otherImages = images.filter((img) => String(img.id) !== String(id));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!currentImg) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center h-screen bg-white">
        <h1 className="text-2xl font-bold mb-4">Image not found</h1>
        <button 
          onClick={() => router.push('/Images')} 
          className="bg-orange-500 text-white px-6 py-2 rounded-full"
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-25 bg-white p-6 md:p-12 sm:mt-10">
      <div className="max-w-5xl mx-auto">
      {/* Main Large Image Container */}
<div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-orange-500 bg-gray-100">
  <div className="relative w-full h-[300px] md:h-[500px]"> {/* Universal Height Limit */}
    <img 
      src={currentImg.image_url} 
      className="absolute inset-0 w-full h-full object-contain md:object-cover" 
      alt={currentImg.description} 
    />
  </div>
</div>
        
        <h1 className="mt-6 text-3xl font-black text-center text-gray-900 uppercase">
          {currentImg.description} {/* Using description from your SQL DB */}
        </h1>

        {/* Iterative "Other Images" Section */}
        <h2 className="mt-20 text-xl font-bold text-orange-600 border-b-2 border-orange-200 pb-2">
          SEE MORE PHOTOS
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {otherImages.map((img) => (
            <div 
              key={img.id} 
              onClick={() => router.push(`/ImageViewPage/${img.id}`)}
              className="cursor-pointer hover:opacity-80 transition-opacity group"
            >
              <div className="overflow-hidden rounded-lg shadow-sm bg-gray-100">
                <img 
                  src={img.image_url} 
                  className="h-32 w-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  alt={img.description}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}