import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { eventService } from '../services/eventService';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await eventService.getAll();
            setEvents(data);
        } catch (error) {
            console.error('Failed to load events:', error);
        } finally {
            setLoading(false);
        }
    };

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
                    Upcoming Events
                </h1>

                {events.length === 0 ? (
                    <div className="glass-card p-8 text-center max-w-2xl mx-auto">
                        <p className="text-gray-300 text-lg">
                            No upcoming events scheduled at the moment. Stay tuned!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card overflow-hidden hover-lift flex flex-col h-full"
                            >
                                {event.banner && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={event.banner}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                    </div>
                                )}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-display text-2xl font-bold text-white mb-2">
                                            {event.title}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400' :
                                                event.status === 'Ongoing' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </div>

                                    <p className="text-gray-400 mb-4 line-clamp-3 flex-1">
                                        {event.description}
                                    </p>

                                    <div className="space-y-2 text-sm text-gray-300 mb-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-neon-blue">📅</span>
                                            {new Date(event.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-neon-blue">📍</span>
                                            {event.location}
                                        </div>
                                    </div>

                                    {event.registrationLink && (
                                        <a
                                            href={event.registrationLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-semibold"
                                        >
                                            Register Now
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
