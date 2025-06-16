import React, { useEffect, useState } from 'react';
import { Header } from './Header';

interface ModelInfo {
  model_name: string;
  svg_url: string;
}

export const ModelsPage: React.FC = () => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/models")
      .then(res => res.json())
      .then(data => {
        setModels(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch models:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      {loading ? (
        <p className="text-gray-400">Loading models...</p>
      ) : models.length === 0 ? (
        <p className="text-gray-500">No models found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map(model => (
            <div key={model.model_name} className="bg-gray-800 p-4 rounded shadow border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">{model.model_name}</h3>
              <div className="bg-gray-900 rounded p-2 overflow-auto border border-gray-600/30">
                <img
                  src={`http://localhost:8000${model.svg_url}`}
                  alt={model.model_name}
                  className="w-full h-auto"
                />
              </div>
              <div className="mt-2 text-right">
                <a
                  href={`http://localhost:8000${model.svg_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-sm"
                >
                  View Fullscreen →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
