import React, { useState } from 'react';
import { Mail, Phone, Building, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import Modal from './Modal';

const initialTeamMembers = [
  { 
    id: 1, 
    name: 'Sarah Chen', 
    role: 'Product Designer',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    department: 'Design',
    skills: ['UI Design', 'UX Design', 'Figma', 'User Research', 'Prototyping'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  { 
    id: 2, 
    name: 'Mike Johnson', 
    role: 'Frontend Developer',
    email: 'mike@example.com',
    phone: '+1 (555) 234-5678',
    department: 'Engineering',
    skills: ['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML', 'Tailwind CSS', 'Redux'],
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  { 
    id: 3, 
    name: 'Alex Turner', 
    role: 'Backend Developer',
    email: 'alex@example.com',
    phone: '+1 (555) 345-6789',
    department: 'Engineering',
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Python', 'Docker', 'AWS'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  { 
    id: 4, 
    name: 'Tom Cook', 
    role: 'Project Manager',
    email: 'tom@example.com',
    phone: '+1 (555) 456-7890',
    department: 'Management',
    skills: ['Project Management', 'Agile', 'Scrum', 'Risk Management', 'Team Leadership', 'Stakeholder Management'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

function Team() {
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    department: '',
    skills: [], // Ensure skills are initialized as empty array
    avatar: ''
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    const newMember = {
      id: teamMembers.length + 1,
      ...formData
    };
    setTeamMembers([...teamMembers, newMember]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      role: '',
      email: '',
      phone: '',
      department: '',
      skills: [],
      avatar: ''
    });
  };

  const handleEditMember = (e) => {
    e.preventDefault();
    setTeamMembers(teamMembers.map(member =>
      member.id === selectedMember.id ? { ...member, ...formData } : member
    ));
    setIsEditModalOpen(false);
    setSelectedMember(null);
  };

  const handleDeleteMember = () => {
    setTeamMembers(teamMembers.filter(member => member.id !== selectedMember.id));
    setIsDeleteModalOpen(false);
    setSelectedMember(null);
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setFormData(member);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData({ ...formData, skills });
  };

  const MemberForm = ({ onSubmit, submitText }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
        <input
          type="text"
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
        <input
          type="text"
          id="department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
          Skills (comma-separated)
        </label>
        <input
          type="text"
          id="skills"
          value={formData.skills.join(', ')}
          onChange={handleSkillsChange}
          placeholder="e.g. JavaScript, React, UI Design"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
          }}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {submitText}
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(member)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(member)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="h-4 w-4 mr-2" />
                {member.email}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="h-4 w-4 mr-2" />
                {member.phone}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Building className="h-4 w-4 mr-2" />
                {member.department}
              </div>
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-700">Skills</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Team Member"
      >
        <MemberForm onSubmit={handleAddMember} submitText="Add Member" />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Team Member"
      >
        <MemberForm onSubmit={handleEditMember} submitText="Save Changes" />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Team Member"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete {selectedMember?.name}? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteMember}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Team;