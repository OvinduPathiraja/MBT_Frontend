import React, { useEffect, useState } from 'react';
import { Download, Maximize2, RefreshCw, Share2, Eye } from 'lucide-react';

interface Story {
  id: string;
  type: 'jira' | 'manual';
  content: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  modelName?: string;  // 👈 Make sure to store this in your story object
}

interface UMLViewerProps {
  stories: Story[];
}

export const UMLViewer: React.FC<UMLViewerProps> = ({ stories }) => {
  const [activeModel, setActiveModel] = useState<'sequence' | 'class' | 'usecase'>('sequence');
  const [svgContent, setSvgContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const completedStories = stories.filter(s => s.status === 'completed' && s.modelName);
  const activeStory = completedStories[completedStories.length - 1]; // show last

  useEffect(() => {
    if (!activeStory?.modelName) return;

    const fetchSVG = async () => {
      try {
        const res = await fetch(`http://localhost:8000/uml/${activeStory.modelName}/svg`);
        const svg = await res.text();
        setSvgContent(svg);
      } catch (err) {
        console.error("Failed to load UML SVG:", err);
        setSvgContent('<p style="color:red;">Failed to load SVG</p>');
      }
    };

    fetchSVG();
  }, [activeStory]);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const modelTypes = [
    { id: 'sequence', name: 'Sequence Diagram', icon: '🔄' },
    { id: 'class', name: 'Class Diagram', icon: '📦' },
    { id: 'usecase', name: 'Use Case Diagram', icon: '👤' },
  ];

  return (
    <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">UML Models</h3>
        </div>

        {completedStories.length > 0 && (
          <div className="flex items-center space-x-2">
            <button onClick={handleRegenerate} disabled={isGenerating}
              className="px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all flex items-center space-x-2">
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
            <button className="px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all">
              <Maximize2 className="w-4 h-4" />
            </button>
            <a
              href={`http://localhost:8000/uml/${activeStory?.modelName}/svg`}
              download={`${activeStory?.modelName}.svg`}
              className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </a>
          </div>
        )}
      </div>

      {activeStory ? (
        <>
          <div className="flex space-x-1 bg-gray-700/50 rounded-lg p-1 mb-6">
            {modelTypes.map((model) => (
              <button
                key={model.id}
                onClick={() => setActiveModel(model.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeModel === model.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
                }`}
              >
                <span>{model.icon}</span>
                <span className="text-sm">{model.name}</span>
              </button>
            ))}
          </div>

          <div className="bg-gray-900/50 rounded-lg border border-white/5 p-4 min-h-96 relative overflow-auto">
            {isGenerating ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Regenerating model...</p>
                </div>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: svgContent }} />
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-600 rounded-lg">
          <div className="text-center">
            <Eye className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No models to display</p>
            <p className="text-gray-500 text-sm">Add and process stories to generate UML models</p>
          </div>
        </div>
      )}
    </div>
  );
};
