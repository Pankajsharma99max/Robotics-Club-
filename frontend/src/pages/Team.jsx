import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { teamService } from '../services/teamService';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const data = await teamService.getAll();
      setMembers(data);
    } catch (error) {
      console.error('Failed to load team:', error);
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

  // Group members by role
  const leadership = members.filter(m => m.role === 'President' || m.role === 'Vice President' || m.role === 'Secretary');
  const leads = members.filter(m => m.role.includes('Lead') && !leadership.includes(m));
  const membersList = members.filter(m => !leadership.includes(m) && !leads.includes(m));

  const MemberCard = ({ member }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 text-center hover-lift"
    >
      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-neon-blue p-1">
        <img
          src={member.image || `https://ui-avatars.com/api/?name=${member.name}&background=0D8ABC&color=fff`}
          alt={member.name}
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <h3 className="font-display text-xl font-bold text-white mb-1">{member.name}</h3>
      <p className="text-neon-blue text-sm mb-4">{member.role}</p>

      <div className="flex justify-center space-x-4">
        {member.socialLinks?.linkedin && (
          <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
            <FaLinkedin size={20} />
          </a>
        )}
        {member.socialLinks?.github && (
          <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <FaGithub size={20} />
          </a>
        )}
        {member.socialLinks?.twitter && (
          <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
            <FaTwitter size={20} />
          </a>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-32 px-4 pb-20">
      <div className="container mx-auto">
        <h1 className="font-display text-5xl font-bold gradient-text mb-12 text-center">
          Our Team
        </h1>

        {members.length === 0 ? (
          <div className="glass-card p-8 text-center max-w-2xl mx-auto">
            <p className="text-gray-300 text-lg">
              Team members are being updated. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Leadership */}
            {leadership.length > 0 && (
              <section>
                <h2 className="text-3xl font-display font-bold text-center mb-8 text-white">Leadership</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center max-w-5xl mx-auto">
                  {leadership.map(member => <MemberCard key={member._id} member={member} />)}
                </div>
              </section>
            )}

            {/* Leads */}
            {leads.length > 0 && (
              <section>
                <h2 className="text-3xl font-display font-bold text-center mb-8 text-white">Team Leads</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {leads.map(member => <MemberCard key={member._id} member={member} />)}
                </div>
              </section>
            )}

            {/* Members */}
            {membersList.length > 0 && (
              <section>
                <h2 className="text-3xl font-display font-bold text-center mb-8 text-white">Core Members</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {membersList.map(member => <MemberCard key={member._id} member={member} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
