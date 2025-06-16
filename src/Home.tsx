import React, { useState } from 'react';
import { Header } from './components/Header';
import { StoryInput } from './components/StoryInput';
import { UMLViewer } from './components/UMLViewer';
import { StorySidebar } from './components/StorySidebar';

interface Story {
  id: string;
  type: 'jira' | 'manual';
  content: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

function Home() {
  const [stories, setStories] = useState<Story[]>([]);

  const handleStoriesUpdate = (updatedStories: Story[]) => {
    setStories(updatedStories);
  };

  const handleStoryRemove = (id: string) => {
    const filtered = stories.filter(story => story.id !== id);
    setStories(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Transform Stories into
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {' '}UML Models
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Import Jira stories or create manual user stories to automatically generate comprehensive UML diagrams for your development workflow.
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <StoryInput onStoriesUpdate={handleStoriesUpdate} />
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          <UMLViewer stories={stories} />
          <StorySidebar stories={stories} onStoryRemove={handleStoryRemove} />
        </div>
      </main>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

export default Home;