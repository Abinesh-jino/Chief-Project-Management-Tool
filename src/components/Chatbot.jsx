import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader } from 'lucide-react';

const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
};

function Chatbot({ onCreateTask, teamMembers }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI Project Manager powered by Chief . How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [lastCreatedTask, setLastCreatedTask] = useState(null);
  
  const API_KEY = 'AIzaSyA6emnXUzcQ0oP7zHZkV7yGH6aeSlcbrQI';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processMessage = async (userMessage) => {
    try {
      setIsLoading(true);
      
      const contextPrompt = `You are a helpful task management assistant. You can help with creating tasks, 
        assigning team members, and providing information. Current team members are: ${teamMembers.map(m => m.name).join(', ')}.
        
        User message: ${userMessage}`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: contextPrompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      let assistantMessage = '';
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        assistantMessage = data.candidates[0].content.parts[0].text;
      } else {
        assistantMessage = "I apologize, but I couldn't generate a proper response at the moment.";
      }

      // Handle task creation
      if (userMessage.toLowerCase().includes('create task') || 
          userMessage.toLowerCase().includes('new task')) {
        const priority = extractPriority(userMessage);
        const assignee = findTeamMember(userMessage) || teamMembers[0];
        
        const newTask = {
          title: assistantMessage.split('\n')[0],
          description: assistantMessage,
          status: TaskStatus.TODO,
          priority,
          assignee: assignee.name,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };

        onCreateTask(newTask);
        setLastCreatedTask(newTask);
      }

      setMessages(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantMessage }
      ]);

    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: 'Sorry, I encountered an error processing your request. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    await processMessage(userMessage);
  };

  const extractPriority = (message) => {
    if (message.includes('urgent') || message.includes('critical') || message.includes('high priority')) {
      return 'High';
    } else if (message.includes('medium priority') || message.includes('normal priority')) {
      return 'Medium';
    } else if (message.includes('low priority')) {
      return 'Low';
    }
    return 'Medium';
  };

  const findTeamMember = (text) => {
    return teamMembers.find(member => 
      text.toLowerCase().includes(member.name.toLowerCase())
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-96 mb-4 border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-900">AI Task Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <Loader className="h-5 w-5 animate-spin text-gray-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Bot className="h-5 w-5 mr-2" />
          Chief AI
        </button>
      )}
    </div>
  );
}

export default Chatbot;