import { Link } from 'react-router-dom';
import { CheckCircle, Lock, Upload, Filter } from 'lucide-react';

export function LandingPage() {
  const sampleProjects = [
    {
      name: 'AI Chat Application',
      batch: 'Fall 2025',
      tags: ['Personal', 'Academic'],
    },
    {
      name: 'Marketing Strategy Deck',
      batch: 'Spring 2026',
      tags: ['Case Comp', 'Client'],
    },
    {
      name: 'Portfolio Website',
      batch: 'Fall 2025',
      tags: ['Personal'],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-blue-900 mb-6">
            ProjTrackr: Track Your Wins
          </h1>
          <p className="text-blue-800 max-w-3xl mx-auto mb-4">
            The ultimate portfolio tracker for students. Log your personal projects, academic assignments, 
            case competition victories, and client work—all in one secure place.
          </p>
          <p className="text-blue-700 max-w-2xl mx-auto mb-8">
            Features include secure authentication, easy form submission with fields for Name, Email, Batch selection, 
            Vibe Code App links with URL validation, GitHub repository links, and optional multi-select tags 
            (Personal/Academic/Case Comp/Client).
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all hover:scale-105"
            >
              Sign Up Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-lg border-2 border-blue-600 text-blue-700 hover:bg-white transition-all hover:scale-105"
            >
              Login
            </Link>
          </div>

          {/* Guest Teaser - Blurred Project Cards */}
          <div className="mb-16">
            <h3 className="text-blue-900 mb-6">See What Others Are Building</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {sampleProjects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-lg blur-sm hover:blur-none transition-all cursor-pointer"
                >
                  <div className="mb-4">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                      {project.batch}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-blue-700">
              Sign up to see full project details and start tracking your own!
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-blue-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-blue-900 mb-3">1. Sign Up Securely</h3>
              <p className="text-gray-600">
                Create your account with email and password. Your data is protected with secure authentication.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-blue-900 mb-3">2. Add Your Projects</h3>
              <p className="text-gray-600">
                Submit project details including name, batch, app links, GitHub repos, and custom tags.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-blue-900 mb-3">3. Track & Filter</h3>
              <p className="text-gray-600">
                View all your projects in one place. Filter by batch, search by name, or sort by tags.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-blue-900 text-center mb-12">
            Why ProjTrackr?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'Secure authentication to protect your portfolio',
              'URL validation for Vibe Code and GitHub links',
              'Multi-tag categorization (Personal, Academic, Case Comp, Client)',
              'Batch tracking for semester organization',
              'Quick search and filter functionality',
              'Edit and delete projects anytime',
              'Responsive design for desktop and mobile',
              'Clean, intuitive interface for easy navigation',
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-blue-800">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-blue-900 mb-6">
            Ready to Track Your Success?
          </h2>
          <p className="text-gray-600 mb-8">
            Join students who are already organizing their portfolios with ProjTrackr.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all hover:scale-105"
            >
              Get Started Now
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            >
              Already Have an Account?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
