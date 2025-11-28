import { useState, useMemo } from 'react';
import { AuthUser } from '../utils/supabase/auth';
import { Project } from '../App';
import { ProjectFormModal } from './ProjectFormModal';
import { Search, Plus, ExternalLink, Github, Edit2, Trash2, Sparkles, AlertCircle } from 'lucide-react';

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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const batches = useMemo(() => {
    return Array.from(new Set(projects.map(p => p.batch))).sort();
  }, [projects]);

  const allTags = ['Personal', 'Academic', 'Case Comp', 'Client'];

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesName = project.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesBatch = !filterBatch || project.batch === filterBatch;
      const matchesTags = filterTags.length === 0 || filterTags.every(tag => project.tags.includes(tag));
      return matchesName && matchesBatch && matchesTags;
    });
  }, [projects, searchName, filterBatch, filterTags]);

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleSubmit = (projectData: Omit<Project, 'id' | 'user_id' | 'created_at'>) => {
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

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      'Personal': 'bg-purple-100 text-purple-700',
      'Academic': 'bg-blue-100 text-blue-700',
      'Case Comp': 'bg-amber-100 text-amber-700',
      'Client': 'bg-pink-100 text-pink-700',
    };
    return colors[tag] || 'bg-gray-100 text-gray-700';
  };

  const getCardHeight = (index: number) => {
    const heights = ['h-72', 'h-80', 'h-64', 'h-96', 'h-76'];
    return heights[index % heights.length];
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header with Welcome */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-amber-500" />
            <h1 className="text-4xl font-extrabold text-gray-900">
              Welcome back, {user.full_name || user.name}!
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            You have {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} to showcase
          </p>
        </div>

        {/* Server Error Message */}
        {serverError && (
          <div className="mb-8 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-1">Server Connection Issue</h3>
                <p className="text-amber-700 leading-relaxed">
                  Unable to connect to the server. Your projects may not load. This is normal for new deployments—the server may take a few moments to start up.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Search your projects..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-200 text-gray-900"
                />
              </div>
            </div>

            {/* Batch Filter */}
            <div className="w-full lg:w-48">
              <select
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium"
              >
                <option value="">All Batches</option>
                {batches.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>

            {/* Add Project Button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-3 px-8 py-3 bg-[#E60023] text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Add Project</span>
            </button>
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-3">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleFilterTag(tag)}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ${
                  filterTags.includes(tag)
                    ? 'bg-pink-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-5 py-2 rounded-full bg-gray-800 text-white font-semibold hover:bg-gray-900 transition-all duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Projects Masonry Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {projects.length === 0 ? 'No projects yet!' : 'No matching projects'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {projects.length === 0 
                ? 'Start building your portfolio by adding your first project.'
                : 'Try adjusting your filters to see more results.'}
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#E60023] text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Project</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group cursor-pointer card-enter"
                style={{ animationDelay: `${index * 50}ms` }}
                onMouseEnter={() => setHoveredCard(project.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                  hoveredCard === project.id ? '-translate-y-2' : ''
                }`}>
                  {/* Project Header with Gradient */}
                  <div className={`${getCardHeight(index)} bg-gradient-to-br from-pink-400 via-rose-400 to-amber-400 p-6 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Action Buttons - Show on Hover */}
                    <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-200 ${
                      hoveredCard === project.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                    }`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(project);
                        }}
                        className="p-2.5 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 hover:scale-110"
                      >
                        <Edit2 className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this project?')) {
                            onDeleteProject(project.id);
                          }
                        }}
                        className="p-2.5 bg-white rounded-full shadow-lg hover:bg-red-50 transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>

                    {/* Tags */}
                    <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 ${getTagColor(tag)} rounded-full text-xs font-bold backdrop-blur-sm`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug line-clamp-2">
                      {project.name}
                    </h3>
                    <p className="text-sm font-semibold text-gray-500 mb-3">
                      {project.batch}
                    </p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-1">
                      {project.email}
                    </p>

                    {/* Links */}
                    <div className="flex gap-2">
                      {project.vibe_link && (
                        <a
                          href={project.vibe_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold hover:bg-purple-100 transition-all duration-200 hover:scale-105"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Demo</span>
                        </a>
                      )}
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-semibold hover:bg-gray-900 transition-all duration-200 hover:scale-105"
                        >
                          <Github className="w-4 h-4" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>
                  </div>
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
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
