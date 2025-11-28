import { useState, useMemo } from 'react';
import { AuthUser } from '../utils/supabase/auth';
import { Project } from '../App';
import { ProjectFormModal } from './ProjectFormModal';
import { Search, Plus, ExternalLink, Github, Edit2, Trash2, Filter } from 'lucide-react';

interface DashboardProps {
  user: AuthUser;
  projects: Project[];
  onAddProject: (project: Omit<Project, 'id' | 'user_id' | 'created_at'>) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
  serverError?: boolean;
}

export function Dashboard({ user, projects, onAddProject, onUpdateProject, onDeleteProject, serverError }: DashboardProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchName, setSearchName] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const batches = ['Fall 2025', 'Spring 2026', 'Fall 2026', 'Spring 2027'];
  const allTags = ['Personal', 'Academic', 'Case Comp', 'Client'];

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Name search
      if (searchName && !project.name.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }
      
      // Batch filter
      if (filterBatch && project.batch !== filterBatch) {
        return false;
      }
      
      // Tags filter (must have ALL selected tags)
      if (filterTags.length > 0) {
        const hasAllTags = filterTags.every(tag => project.tags.includes(tag));
        if (!hasAllTags) {
          return false;
        }
      }
      
      return true;
    });
  }, [projects, searchName, filterBatch, filterTags]);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDeleteProject(id);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleModalSubmit = (projectData: Omit<Project, 'id' | 'user_id' | 'created_at'>) => {
    if (editingProject) {
      onUpdateProject(editingProject.id, projectData);
    } else {
      onAddProject(projectData);
    }
    handleModalClose();
  };

  const toggleFilterTag = (tag: string) => {
    setFilterTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchName('');
    setFilterBatch('');
    setFilterTags([]);
  };

  const hasActiveFilters = searchName || filterBatch || filterTags.length > 0;

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-blue-900 mb-2">Your Projects</h1>
            <p className="text-blue-700">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Project</span>
          </button>
        </div>

        {/* Server Error Message */}
        {serverError && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-yellow-800 font-medium">Server Connection Issue</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Unable to connect to the server. Your projects may not load. This is normal for new deployments - the server may take a few moments to start up.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Batch Filter */}
            <div>
              <select
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Batches</option>
                {batches.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>

            {/* Tags Multi-Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    {filterTags.length === 0 
                      ? 'Filter by tags' 
                      : `${filterTags.length} tag${filterTags.length > 1 ? 's' : ''} selected`}
                  </span>
                </span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showFilterDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {allTags.map(tag => (
                    <label
                      key={tag}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filterTags.includes(tag)}
                        onChange={() => toggleFilterTag(tag)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="flex flex-wrap gap-2">
                {searchName && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Name: "{searchName}"
                  </span>
                )}
                {filterBatch && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Batch: {filterBatch}
                  </span>
                )}
                {filterTags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Tag: {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-blue-900 mb-2">
              {hasActiveFilters ? 'No Projects Found' : 'No Projects Yet'}
            </h2>
            <p className="text-gray-600 mb-6">
              {hasActiveFilters 
                ? 'Try adjusting your filters to see more results.'
                : 'Start building your portfolio by adding your first project!'}
            </p>
            {!hasActiveFilters && (
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all"
              >
                <div className="mb-4">
                  <h3 className="text-blue-900 mb-2">{project.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                      {project.batch}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-3 mb-4">
                  <a
                    href={project.vibe_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Vibe App</span>
                  </a>
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900 text-sm"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      {showModal && (
        <ProjectFormModal
          project={editingProject}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
