import React, { useState } from 'react';
import { Link, FileText, Plus, Loader2 } from 'lucide-react';

interface Story {
  id: string;
  type: 'jira' | 'manual';
  content: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface StoryInputProps {
  onStoriesUpdate: (stories: Story[]) => void;
}

export const StoryInput: React.FC<StoryInputProps> = ({ onStoriesUpdate }) => {
  const [activeTab, setActiveTab] = useState<'jira' | 'manual'>('jira');
  const [jiraUrl, setJiraUrl] = useState('');
  const [manualStory, setManualStory] = useState('');
  const [stories, setStories] = useState<Story[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addJiraStory = async () => {
    if (!jiraUrl.trim()) return;
    
    setIsProcessing(true);
    const newStory: Story = {
      id: Date.now().toString(),
      type: 'jira',
      content: jiraUrl,
      title: `Jira Story: ${jiraUrl.split('/').pop()}`,
      status: 'processing'
    };

    const updatedStories = [...stories, newStory];
    setStories(updatedStories);
    onStoriesUpdate(updatedStories);

    // Simulate processing
    setTimeout(() => {
      const processed = updatedStories.map(s => 
        s.id === newStory.id ? { ...s, status: 'completed' as const } : s
      );
      setStories(processed);
      onStoriesUpdate(processed);
      setIsProcessing(false);
    }, 2000);

    setJiraUrl('');
  };

  const addManualStory = async () => {
  if (!manualStory.trim()) return;

  const newStory: Story = {
    id: Date.now().toString(),
    type: 'manual',
    content: manualStory,
    title: `User Story: ${manualStory.substring(0, 50)}...`,
    status: 'processing'
  };

  const updatedStories = [...stories, newStory];
  setStories(updatedStories);
  onStoriesUpdate(updatedStories);

  try {
    const res = await fetch("http://localhost:8000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_story: manualStory })
    });

    if (!res.ok) throw new Error("API failed");

    const data = await res.json();
    console.log("✅ UML generated:", data);

    const processed = updatedStories.map(s =>
      s.id === newStory.id
        ? {
            ...s,
            status: 'completed' as const,
            modelName: data.model_name  // ✅ save the model name
          }
        : s
    );

    setStories(processed);
    onStoriesUpdate(processed);
  } catch (err) {
    console.error("❌ Error:", err);
    const errored = updatedStories.map(s =>
      s.id === newStory.id
        ? { ...s, status: 'error' as const }
        : s
    );
    setStories(errored);
    onStoriesUpdate(errored);
  } finally {
    setIsProcessing(false);
    setManualStory('');
  }
};


  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Story Input</h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-700/50 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('jira')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all ${
            activeTab === 'jira'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
          }`}
        >
          <Link className="w-4 h-4" />
          <span>Jira Stories</span>
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all ${
            activeTab === 'manual'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Manual Input</span>
        </button>
      </div>

      {/* Jira Input */}
      {activeTab === 'jira' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Jira Story URL
            </label>
            <div className="flex space-x-3">
              <input
                type="url"
                value={jiraUrl}
                onChange={(e) => setJiraUrl(e.target.value)}
                placeholder="https://your-domain.atlassian.net/browse/PROJ-123"
                className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addJiraStory}
                disabled={!jiraUrl.trim() || isProcessing}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Input */}
      {activeTab === 'manual' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              User Story
            </label>
            <div className="space-y-3">
              <textarea
                value={manualStory}
                onChange={(e) => setManualStory(e.target.value)}
                placeholder="As a user, I want to... so that..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={addManualStory}
                disabled={!manualStory.trim() || isProcessing}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Add Story</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};