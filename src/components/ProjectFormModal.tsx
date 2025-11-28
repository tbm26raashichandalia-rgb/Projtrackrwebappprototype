import { useState, useEffect } from 'react';
import { Project } from '../App';
import { X, Save, Plus, Sparkles } from 'lucide-react';

interface ProjectFormModalProps {
  project: Project | null;
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id' | 'user_id' | 'created_at'>) => void;
}

export function ProjectFormModal({ project, onClose, onSubmit }: ProjectFormModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [batch, setBatch] = useState('');
  const [vibeLink, setVibeLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (project) {
      setName(project.name);
      setEmail(project.email);
      setBatch(project.batch);
      setVibeLink(project.vibe_link);
      setGithubLink(project.github_link);
      setTags(project.tags);
    }
  }, [project]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!batch.trim()) {
      newErrors.batch = 'Batch is required';
    }

    if (vibeLink && !vibeLink.startsWith('https://')) {
      newErrors.vibeLink = 'Vibe link must start with https://';
    }

    if (githubLink && !githubLink.includes('github.com/')) {
      newErrors.githubLink = 'GitHub link must contain github.com/';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name,
        email,
        batch,
        vibe_link: vibeLink,
        github_link: githubLink,
        tags,
      });
    }
  };

  const toggleTag = (tag: string) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const allTags = ['Personal', 'Academic', 'Case Comp', 'Client'];

  const getTagColor = (tag: string, selected: boolean) => {
    if (!selected) return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    
    const colors: { [key: string]: string } = {
      'Personal': 'bg-purple-500 text-white',
      'Academic': 'bg-blue-500 text-white',
      'Case Comp': 'bg-amber-500 text-white',
      'Client': 'bg-pink-500 text-white',
    };
    return colors[tag] || 'bg-gray-500 text-white';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {project ? 'Edit Project' : 'Add New Project'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
              Project Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Project"
              className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                errors.name 
                  ? 'border-red-400 focus:border-red-500' 
                  : 'border-transparent focus:border-pink-500 focus:bg-white'
              }`}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                errors.email 
                  ? 'border-red-400 focus:border-red-500' 
                  : 'border-transparent focus:border-pink-500 focus:bg-white'
              }`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Batch */}
          <div>
            <label htmlFor="batch" className="block text-sm font-bold text-gray-900 mb-2">
              Batch *
            </label>
            <select
              id="batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                errors.batch 
                  ? 'border-red-400 focus:border-red-500' 
                  : 'border-transparent focus:border-pink-500 focus:bg-white'
              }`}
            >
              <option value="">Select a batch</option>
              <option value="Fall 2024">Fall 2024</option>
              <option value="Spring 2025">Spring 2025</option>
              <option value="Fall 2025">Fall 2025</option>
              <option value="Spring 2026">Spring 2026</option>
              <option value="Fall 2026">Fall 2026</option>
            </select>
            {errors.batch && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.batch}</p>
            )}
          </div>

          {/* Vibe Link */}
          <div>
            <label htmlFor="vibeLink" className="block text-sm font-bold text-gray-900 mb-2">
              Vibe Code App Link
            </label>
            <input
              id="vibeLink"
              type="url"
              value={vibeLink}
              onChange={(e) => setVibeLink(e.target.value)}
              placeholder="https://your-vibe-app.com"
              className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                errors.vibeLink 
                  ? 'border-red-400 focus:border-red-500' 
                  : 'border-transparent focus:border-pink-500 focus:bg-white'
              }`}
            />
            {errors.vibeLink && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.vibeLink}</p>
            )}
          </div>

          {/* GitHub Link */}
          <div>
            <label htmlFor="githubLink" className="block text-sm font-bold text-gray-900 mb-2">
              GitHub Repository Link
            </label>
            <input
              id="githubLink"
              type="url"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              placeholder="https://github.com/username/repo"
              className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                errors.githubLink 
                  ? 'border-red-400 focus:border-red-500' 
                  : 'border-transparent focus:border-pink-500 focus:bg-white'
              }`}
            />
            {errors.githubLink && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.githubLink}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Project Tags
            </label>
            <div className="flex flex-wrap gap-3">
              {allTags.map(tag => {
                const selected = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-5 py-3 rounded-full font-semibold transition-all duration-200 ${
                      getTagColor(tag, selected)
                    } ${selected ? 'scale-105 shadow-md' : ''}`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Select all that apply
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-[#E60023] text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              {project ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              <span>{project ? 'Save Changes' : 'Add Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
