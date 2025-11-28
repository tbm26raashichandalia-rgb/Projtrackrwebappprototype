import { useState, useEffect } from 'react';
import { Project } from '../App';
import { X, AlertCircle } from 'lucide-react';

interface ProjectFormModalProps {
  project: Project | null;
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id' | 'user_id' | 'created_at'>) => void;
}

export function ProjectFormModal({ project, onClose, onSubmit }: ProjectFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    batch: 'Fall 2025',
    vibe_link: '',
    github_link: '',
    tags: [] as string[],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const batches = ['Fall 2025', 'Spring 2026', 'Fall 2026', 'Spring 2027'];
  const allTags = ['Personal', 'Academic', 'Case Comp', 'Client'];

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        email: project.email,
        batch: project.batch,
        vibe_link: project.vibe_link,
        github_link: project.github_link,
        tags: project.tags,
      });
    }
  }, [project]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Vibe link validation
    if (!formData.vibe_link.trim()) {
      newErrors.vibe_link = 'Vibe Code App link is required';
    } else if (!formData.vibe_link.startsWith('https://')) {
      newErrors.vibe_link = 'Vibe link must start with https://';
    }

    // GitHub link validation
    if (!formData.github_link.trim()) {
      newErrors.github_link = 'GitHub repository link is required';
    } else if (!formData.github_link.includes('github.com/')) {
      newErrors.github_link = 'GitHub link must contain github.com/';
    }

    // Batch validation
    if (!formData.batch) {
      newErrors.batch = 'Please select a batch';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-blue-900">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="E.g., E-Commerce Platform"
            />
            {errors.name && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Batch Dropdown */}
          <div>
            <label htmlFor="batch" className="block text-gray-700 mb-2">
              Batch <span className="text-red-500">*</span>
            </label>
            <select
              id="batch"
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.batch ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {batches.map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
            {errors.batch && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.batch}</span>
              </div>
            )}
          </div>

          {/* Vibe Code App Link */}
          <div>
            <label htmlFor="vibe_link" className="block text-gray-700 mb-2">
              Vibe Code App Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="vibe_link"
              value={formData.vibe_link}
              onChange={(e) => setFormData({ ...formData, vibe_link: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.vibe_link ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://myapp.vercel.app"
            />
            {errors.vibe_link && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.vibe_link}</span>
              </div>
            )}
            <p className="text-gray-500 text-sm mt-1">Must start with https://</p>
          </div>

          {/* GitHub Repo Link */}
          <div>
            <label htmlFor="github_link" className="block text-gray-700 mb-2">
              GitHub Repository Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="github_link"
              value={formData.github_link}
              onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.github_link ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://github.com/username/repo"
            />
            {errors.github_link && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.github_link}</span>
              </div>
            )}
            <p className="text-gray-500 text-sm mt-1">Must contain github.com/</p>
          </div>

          {/* Tags Multi-Select */}
          <div>
            <label className="block text-gray-700 mb-2">
              Tags (Optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {allTags.map(tag => (
                <label
                  key={tag}
                  className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.tags.includes(tag)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className={formData.tags.includes(tag) ? 'text-blue-700' : 'text-gray-700'}>
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {project ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
