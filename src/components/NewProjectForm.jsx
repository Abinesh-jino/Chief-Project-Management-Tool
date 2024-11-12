import React, { useState } from 'react';
import { Calendar, User } from 'lucide-react';

function NewProjectForm({ onSubmit, onClose, teamMembers }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    members: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'Active',
      tasks: [],
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      members: selectedOptions
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="members" className="block text-sm font-medium text-gray-700">
          Team Members
        </label>
        <div className="mt-1 relative">
          <select
            multiple
            name="members"
            id="members"
            value={formData.members}
            onChange={handleMemberChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {teamMembers.map(member => (
              <option key={member.id} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>
          <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple members</p>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <div className="mt-1 relative">
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            required
            value={formData.dueDate}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Project
        </button>
      </div>
    </form>
  );
}

export default NewProjectForm;