import React, { useState } from 'react';
import { UserPlus, Mail, Check } from 'lucide-react';
import Modal from './Modal';

function TeamSection() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState(null);

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteStatus('sending');

    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (response.ok) {
        const inviteToken = await response.json();
        
        // Send email invitation
        const emailResponse = await fetch('/api/send-invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: inviteEmail,
            inviteToken: inviteToken.token
          }),
        });

        if (emailResponse.ok) {
          setInviteStatus('success');
          setTimeout(() => {
            setInviteStatus(null);
            setInviteEmail('');
            setIsInviteModalOpen(false);
          }, 2000);
        } else {
          throw new Error('Failed to send email invitation');
        }
      } else {
        throw new Error('Failed to create invitation');
      }
    } catch (error) {
      console.error('Invitation error:', error);
      setInviteStatus('error');
    }
  };

  return (
    <div className="mt-auto border-t border-gray-200 pt-4">
      <button
        onClick={() => setIsInviteModalOpen(true)}
        className="group flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
      >
        <UserPlus className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
        Invite Team Member
      </button>

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => {
          setIsInviteModalOpen(false);
          setInviteStatus(null);
        }}
        title="Invite Team Member"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1 relative">
              <input
                type="email"
                name="email"
                id="email"
                required
                disabled={inviteStatus === 'sending'}
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="colleague@example.com"
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {inviteStatus === 'success' && (
            <div className="flex items-center text-green-600 text-sm">
              <Check className="h-4 w-4 mr-2" />
              Invitation sent successfully!
            </div>
          )}

          {inviteStatus === 'error' && (
            <div className="text-red-600 text-sm">
              Failed to send invitation. Please try again.
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsInviteModalOpen(false);
                setInviteStatus(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              disabled={inviteStatus === 'sending'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviteStatus === 'sending'}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {inviteStatus === 'sending' ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default TeamSection;