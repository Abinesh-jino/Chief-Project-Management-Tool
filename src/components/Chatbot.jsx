import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader, Paperclip } from 'lucide-react';

const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
};

const RATE_LIMIT_INTERVAL = 1000;
let lastRequestTime = 0;

function Chatbot({ onCreateTask, teamMembers }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI Project Manager powered by Chief. You can upload files and ask me questions about them, or I can help with project management tasks.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [lastCreatedTask, setLastCreatedTask] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);

  const API_KEY = 'AIzaSyABdNduTl0HyWac3NdgmTuDYAPyXwbB2zY';
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf', 
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Please upload only PDF, Excel, or TXT files.'
      }]);
      return;
    }

    if (file.size > maxSize) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'File size should be less than 5MB.'
      }]);
      return;
    }

    setPendingFile(file);
    setSelectedFile(file);
  };

  const clearFile = () => {
    setPendingFile(null);
    setSelectedFile(null);
    setFileContent(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFileUpload = async (file) => {
    try {
      setIsLoading(true);
      const reader = new FileReader();

      reader.onload = async (e) => {
        const content = e.target.result;
        setFileContent(content);
        setFileName(file.name);
        
        const fileType = file.type;
        const initialAnalysis = `I've loaded "${file.name}". It's a ${fileType} file. You can now ask me questions about its contents. For example:
- Ask about specific data points or sections
- Request summary or analysis
- Compare different parts of the content
- Extract specific information
What would you like to know about this file?`;
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: initialAnalysis
        }]);
      };

      if (file.type.includes('pdf') || file.type.includes('excel') || 
          file.type.includes('spreadsheet') || file.type.includes('text')) {
        reader.readAsText(file);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your file. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const processMessage = async (userMessage) => {
    try {
      setIsLoading(true);

      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      if (timeSinceLastRequest < RATE_LIMIT_INTERVAL) {
        await delay(RATE_LIMIT_INTERVAL - timeSinceLastRequest);
      }

      const contextPrompt = fileContent 
        ? `I am an AI assistant analyzing a ${fileName}. 
           
           File content: ${fileContent}
           
           User question: ${userMessage}
           
           Please provide a detailed analysis and direct answer based on the file contents.
           If asked about specific data, quote relevant sections.
           If the information isn't in the file, say so clearly.`
        : `You are an AI Project Manager. You can help with creating tasks,
           assigning team members, and providing recommendations based on skills.
           
           Available team members:
           ${teamMembers.map(m => `
           - ${m.name} (${m.role})
             Department: ${m.department}
             Skills: ${Array.isArray(m.skills) ? m.skills.join(', ') : 'No skills listed'}
           `).join('\n')}
           
           User message: ${userMessage}`;

      lastRequestTime = Date.now();

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: contextPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(response.status === 429 
          ? 'Rate limit exceeded. Please wait a moment before trying again.'
          : `API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text 
        ?? 'I couldn\'t process that request. Please try again.';

      if (userMessage.toLowerCase().includes('create task') || 
          userMessage.toLowerCase().includes('new task')) {
        const newTask = {
          title: assistantMessage.split('\n')[0],
          description: assistantMessage,
          status: TaskStatus.TODO,
          priority: extractPriority(userMessage),
          assignee: findTeamMember(userMessage)?.name || teamMembers[0].name,
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
        { role: 'assistant', content: `Error: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !pendingFile) return;

    const userMessage = input;
    setInput('');

    if (pendingFile) {
      await processFileUpload(pendingFile);
      setPendingFile(null);
    }
    
    if (userMessage) {
      await processMessage(userMessage);
    }
  };

  const extractPriority = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('urgent') || 
        lowerMessage.includes('critical') || 
        lowerMessage.includes('high priority')) {
      return 'High';
    } else if (lowerMessage.includes('medium priority') || 
               lowerMessage.includes('normal priority')) {
      return 'Medium';
    } else if (lowerMessage.includes('low priority')) {
      return 'Low';
    }
    return 'Medium';
  };

  const findTeamMember = (text) => {
    const relevantKeywords = text.toLowerCase().split(' ');
    
    return teamMembers.find(member => {
      if (text.toLowerCase().includes(member.name.toLowerCase())) {
        return true;
      }
      
      if (text.toLowerCase().includes(member.role.toLowerCase())) {
        return true;
      }
      
      const memberSkills = Array.isArray(member.skills) ? member.skills : [];
      return memberSkills.some(skill => 
        relevantKeywords.some(keyword => skill.toLowerCase().includes(keyword))
      );
    });
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-96 mb-4 border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-900">AI Project Manager</h3>
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
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user'
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
                placeholder={pendingFile ? "Add a message with your file (optional)" : "Type your message..."}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.xlsx,.xls"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {selectedFile && (
              <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
                <span>Selected file: {selectedFile.name}</span>
                <button
                  type="button"
                  onClick={clearFile}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            )}
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