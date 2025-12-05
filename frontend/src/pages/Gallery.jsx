import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService } from '../services/galleryService';
import { FaTimes } from 'react-icons/fa';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        loadGallery();
    }, []);

    const loadGallery = async () => {
        try {
            const data = await galleryService.getAll();
            setImages(data);
        } catch (error) {
            console.error('Failed to load gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(images.map(img => img.category))];
    const filteredImages = filter === 'All'
        ? images
        : images.filter(img => img.category === filter);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 px-4 pb-20">
            <div className="container mx-auto">
                <h1 className="font-display text-5xl font-bold gradient-text mb-12 text-center">
                    Gallery
                </h1>

                {/* Filters */}
                {categories.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setFilter(category)}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${filter === category
                                        ? 'bg-neon-blue text-black shadow-lg shadow-neon-blue/25'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}

                {images.length === 0 ? (
                    <div className="glass-card p-8 text-center max-w-2xl mx-auto">
                        <p className="text-gray-300 text-lg">
                            Our gallery is being curated. Check back soon for photos!
                        </p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {filteredImages.map((image, index) => (
                            <motion.div
                                key={image._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="break-inside-avoid"
                            >
                                <div
                                    className="glass-card overflow-hidden hover-lift cursor-pointer group relative"
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <img
                                        src={image.imageUrl}
                                        alt={image.caption}
                                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                        <p className="text-white text-center font-medium">
                                            {image.caption}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                            onClick={() => setSelectedImage(null)}
                        >
                            <button
                                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                                onClick={() => setSelectedImage(null)}
                            >
                                <FaTimes size={32} />
                            </button>
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="max-w-5xl max-h-[90vh] relative"
                                onClick={e => e.stopPropagation()}
                            >
                                <img
                                    src={selectedImage.imageUrl}
                                    alt={selectedImage.caption}
                                    className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                                />
                                {selectedImage.caption && (
                                    <p className="text-white text-center mt-4 text-lg font-medium">
                                        {selectedImage.caption}
                                    </p>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Gallery;
