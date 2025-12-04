import Event from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
    try {
        const { type, upcoming } = req.query;
        let query = {};

        if (type) {
            query.type = type;
        }

        if (upcoming === 'true') {
            query.date = { $gte: new Date() };
        } else if (upcoming === 'false') {
            query.date = { $lt: new Date() };
        }

        const events = await Event.find(query).sort({ date: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
    try {
        const eventData = { ...req.body };

        // Handle file uploads
        if (req.files) {
            if (req.files.banner) {
                eventData.banner = `/uploads/${req.files.banner[0].filename}`;
            }
            if (req.files.schedulePDF) {
                eventData.schedulePDF = `/uploads/${req.files.schedulePDF[0].filename}`;
            }
        }

        const event = await Event.create(eventData);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const updateData = { ...req.body };

        // Handle file uploads
        if (req.files) {
            if (req.files.banner) {
                updateData.banner = `/uploads/${req.files.banner[0].filename}`;
            }
            if (req.files.schedulePDF) {
                updateData.schedulePDF = `/uploads/${req.files.schedulePDF[0].filename}`;
            }
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
