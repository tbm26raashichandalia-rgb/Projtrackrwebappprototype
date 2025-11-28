import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Zap, Star, ArrowRight, BookOpen, Trophy, Palette } from 'lucide-react';

export function LandingPage() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setHeroVisible(true);
  }, []);

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Organize Beautifully',
      description: 'Keep all your projects, assignments, and wins in one stunning visual space.',
      color: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Showcase Your Wins',
      description: 'Display case competition victories and client work with pride.',
      color: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Tag & Filter',
      description: 'Easily find what you need with smart tagging and powerful filters.',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Add projects in seconds with our intuitive, friendly interface.',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Made for Students',
      description: 'Designed with students in mind—simple, powerful, and delightful to use.',
      color: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Portfolio Ready',
      description: 'Turn your project tracker into a resume-worthy portfolio instantly.',
      color: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
  ];

  const projectExamples = [
    {
      title: 'AI E-Commerce Platform',
      category: 'Personal Project',
      tags: ['React', 'AI', 'Full Stack'],
      color: 'from-purple-400 to-pink-400',
      height: 'h-72',
    },
    {
      title: 'Marketing Strategy Analysis',
      category: 'Case Competition Win',
      tags: ['Strategy', 'Business'],
      color: 'from-amber-400 to-orange-400',
      height: 'h-64',
    },
    {
      title: 'Mobile App Portfolio',
      category: 'Academic',
      tags: ['Design', 'Mobile'],
      color: 'from-blue-400 to-cyan-400',
      height: 'h-80',
    },
    {
      title: 'Client Website Redesign',
      category: 'Client Work',
      tags: ['Web Design', 'UX'],
      color: 'from-green-400 to-teal-400',
      height: 'h-68',
    },
    {
      title: 'Data Science Research',
      category: 'Academic',
      tags: ['Python', 'ML'],
      color: 'from-indigo-400 to-purple-400',
      height: 'h-76',
    },
  ];

  const testimonials = [
    {
      quote: "ProjTrackr is like Pinterest for my projects—visual, organized, and absolutely beautiful!",
      author: "Alex Chen",
      role: "CS '26",
      avatar: "🎨",
    },
    {
      quote: "Finally, a project tracker that doesn't feel like work. It's actually fun to use!",
      author: "Jordan Rivera",
      role: "MBA '25",
      avatar: "✨",
    },
    {
      quote: "The masonry layout makes browsing my projects feel like scrolling through inspiration.",
      author: "Sam Taylor",
      role: "Design '25",
      avatar: "🌟",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div 
            className={`text-center transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-sm font-semibold text-gray-700">Track. Organize. Shine.</span>
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Your Projects,
              <br />
              <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
                Beautifully Organized
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              A visual, delightful way for students to track personal projects, academic assignments, 
              case competition wins, and client work—all in one stunning space.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/signup"
                className="group flex items-center gap-3 px-8 py-4 bg-[#E60023] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <span className="font-bold text-lg">Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login"
                className="flex items-center gap-2 px-8 py-4 bg-white text-gray-800 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <span className="font-semibold text-lg">Sign In</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Project Preview Section - Masonry Style */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              See Your Projects Come to Life
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse your work like never before—with a Pinterest-inspired layout that makes every project shine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectExamples.map((project, index) => (
              <div
                key={index}
                className={`${project.height} group cursor-pointer`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-full bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:-translate-y-2">
                  <div className={`h-2/3 bg-gradient-to-br ${project.color} p-6 flex items-end relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 mb-2">
                        {project.category}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need, Beautifully Simple
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your journey from first project to portfolio-ready showcase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`inline-flex p-4 ${feature.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  <div className={feature.iconColor}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Loved by Students Everywhere
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands who've transformed how they track their work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-amber-400 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Get Organized?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Start tracking your projects beautifully today. No credit card required.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-rose-600 rounded-full text-lg font-bold shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <span>Create Your Free Account</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span className="text-2xl font-bold">ProjTrackr</span>
          </div>
          <p className="text-gray-400">
            Made with <Heart className="w-4 h-4 inline text-pink-500 fill-pink-500" /> for students who create amazing things.
          </p>
        </div>
      </div>
    </div>
  );
}
