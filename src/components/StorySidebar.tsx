import React from 'react';
import { CheckCircle, Clock, AlertCircle, Trash2, ExternalLink } from 'lucide-react';

interface Story {
  id: string;
  type: 'jira' | 'manual';
  content: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface StorySidebarProps {
  stories: Story[];
  onStoryRemove: (id: string) => void;
}

export const StorySidebar: React.FC<StorySidebarProps> = ({ stories, onStoryRemove }) => {
  const getStatusIcon = (status: Story['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: Story['status']) => {
    switch (status) {
      case 'completed':
        return 'Model Generated';
      case 'processing':
        return 'Processing...';
      case 'error':
        return 'Error';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="w-80 bg-gray-800/30 backdrop-blur-sm border-l border-white/10 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Stories</h3>
        <p className="text-sm text-gray-400">
          {stories.length} {stories.length === 1 ? 'story' : 'stories'} loaded
        </p>
      </div>

      <div className="space-y-3">
        {stories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No stories added yet</p>
            <p className="text-gray-600 text-xs mt-1">Add Jira links or manual stories to get started</p>
          </div>
        ) : (
          stories.map((story) => (
            <div
              key={story.id}
              className="bg-gray-700/30 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {story.type === 'jira' ? (
                    <ExternalLink className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 bg-purple-500 rounded-sm flex-shrink-0" />
                  )}
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    {story.type}
                  </span>
                </div>
                <button
                  onClick={() => onStoryRemove(story.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">
                {story.title}
              </h4>

              <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                {story.type === 'jira' 
                  ? story.content 
                  : story.content.length > 80 
                    ? `${story.content.substring(0, 80)}...`
                    : story.content
                }
              </p>

              <div className="flex items-center space-x-2">
                {getStatusIcon(story.status)}
                <span className="text-xs text-gray-400">
                  {getStatusText(story.status)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};