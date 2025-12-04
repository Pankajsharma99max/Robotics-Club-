import TeamMember from '../models/TeamMember.js';

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
export const getTeamMembers = async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};

        const members = await TeamMember.find(query).sort({ order: 1, createdAt: -1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
export const getTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create team member
// @route   POST /api/team
// @access  Private
export const createTeamMember = async (req, res) => {
    try {
        const memberData = { ...req.body };

        // Parse socialLinks if it's a string
        if (typeof memberData.socialLinks === 'string') {
            memberData.socialLinks = JSON.parse(memberData.socialLinks);
        }

        // Handle image upload
        if (req.file) {
            memberData.image = `/uploads/${req.file.filename}`;
        }

        const member = await TeamMember.create(memberData);
        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private
export const updateTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        const updateData = { ...req.body };

        // Parse socialLinks if it's a string
        if (typeof updateData.socialLinks === 'string') {
            updateData.socialLinks = JSON.parse(updateData.socialLinks);
        }

        // Handle image upload
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedMember = await TeamMember.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json(updatedMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private
export const deleteTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        await TeamMember.findByIdAndDelete(req.params.id);
        res.json({ message: 'Team member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
