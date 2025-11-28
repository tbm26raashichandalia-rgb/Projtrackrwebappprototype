import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Lock, Upload, Filter, Trophy, Lightbulb, Edit, FileText, Github, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setHeroVisible(true);
  }, []);

  const sampleProjects = [
    {
      name: 'AI E-Commerce Platform',
      batch: 'Fall 2025',
      tags: ['Personal', 'Academic'],
      partialName: 'AI E... Win',
    },
    {
      name: 'Marketing Strategy Analysis',
      batch: 'Spring 2026',
      tags: ['Case Comp', 'Client'],
      partialName: 'Marketing... Ana',
    },
    {
      name: 'Mobile App Portfolio',
      batch: 'Fall 2025',
      tags: ['Personal'],
      partialName: 'Mobile... Port',
    },
  ];

  const testimonials = [
    {
      quote: "ProjTrackr turned my scattered notes into a resume-ready showcase in minutes!",
      author: "Alex Chen",
      role: "CS '26",
      avatar: "AC",
    },
    {
      quote: "Finally, one place for all my case comp wins and client projects. Game changer!",
      author: "Jordan Rivera",
      role: "MBA '25",
      avatar: "JR",
    },
    {
      quote: "The GitHub integration and tagging system made organizing 20+ projects effortless.",
      author: "Sam Taylor",
      role: "Engineering '27",
      avatar: "ST",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Above the Fold */}
      <section className="relative bg-gradient-to-br from-[#A7C7E7] to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Stack */}
            <div className={`transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-blue-900 mb-6 leading-tight">
                Build Your Student Portfolio, Effortlessly
              </h1>
              <p className="text-xl text-blue-800 mb-8 leading-relaxed">
                Track projects, case wins, and client gigs in one secure hub. Submit with name, email, batch, 
                public Vibe Code links, and GitHub repos—then filter, edit, and export realtime.
              </p>
              
              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link
                  to="/signup"
                  className="group px-8 py-4 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    Start Free – No Card Needed
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 rounded-lg border-2 border-blue-600 text-blue-700 hover:bg-white hover:shadow-lg transition-all"
                >
                  Already Have an Account? Log In
                </Link>
              </div>
              
              <a 
                href="#teaser"
                className="text-blue-600 hover:text-blue-800 underline inline-block"
              >
                See It in Action ↓
              </a>
            </div>

            {/* Right: Hero Image */}
            <div className={`transition-all duration-1000 delay-300 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1728023881214-1d71a7a30a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGxhcHRvcCUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzY0MzA1MjA3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Students curating achievements in ProjTrackr"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-xl p-4 hidden lg:block">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">Secure & Realtime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48L60 42C120 36 240 24 360 18C480 12 600 12 720 18C840 24 960 36 1080 42C1200 48 1320 48 1380 48L1440 48V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V48Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-blue-900 mb-4">
              Everything You Need to Showcase Your Wins
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From secure authentication to real-time filtering, ProjTrackr gives you professional tools to organize and present your achievements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Secure Auth */}
            <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-blue-900 mb-3">Secure & Simple Auth</h3>
              <p className="text-gray-600 leading-relaxed">
                Email signup/login with forgot password recovery. Own your data via Supabase encryption.
              </p>
            </div>

            {/* Card 2: Effortless CRUD */}
            <div className="group bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 hover:border-green-300 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Edit className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-blue-900 mb-3">Effortless CRUD</h3>
              <p className="text-gray-600 leading-relaxed">
                Create via validated forms. Read and filter realtime, update and delete with one click.
              </p>
            </div>

            {/* Card 3: Portfolio Power */}
            <div className="group bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 hover:border-purple-300 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-blue-900 mb-3">Portfolio Power</h3>
              <p className="text-gray-600 leading-relaxed">
                Tag projects as Personal, Academic, Case Comp, or Client. Perfect for resume building.
              </p>
            </div>

            {/* Card 4: Student-First */}
            <div className="group bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl border border-yellow-100 hover:border-yellow-300 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 bg-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-blue-900 mb-3">Student-First Vibe</h3>
              <p className="text-gray-600 leading-relaxed">
                Public teasers inspire creativity. Realtime sync keeps you motivated and organized.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Teaser Section with Social Proof */}
      <section id="teaser" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#A7C7E7] to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-blue-900 mb-4">
              See What Students Are Tracking
            </h2>
            <p className="text-blue-700 max-w-2xl mx-auto">
              Peek at real portfolios—login to unlock yours and join thousands of students organizing their wins.
            </p>
          </div>

          {/* Blurred Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {sampleProjects.map((project, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-6 shadow-xl blur-[2px] hover:blur-none transition-all duration-300 cursor-pointer group"
              >
                <div className="mb-4">
                  <h3 className="text-gray-400 mb-2">{project.partialName}</h3>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                    {project.batch}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 opacity-50">
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <ExternalLink className="w-4 h-4" />
                    <span>Vibe</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </div>
                </div>
                
                {/* Overlay CTA */}
                <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-90 rounded-2xl transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:scale-105 transition-transform"
                  >
                    Log In to View Full
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials Carousel */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <svg className="w-12 h-12 text-blue-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              <div className="transition-all duration-500">
                <p className="text-xl text-gray-700 text-center mb-6 leading-relaxed italic">
                  "{testimonials[currentTestimonial].quote}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div>
                    <p className="text-blue-900">{testimonials[currentTestimonial].author}</p>
                    <p className="text-gray-600 text-sm">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </div>

              {/* Testimonial Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-center mt-8 text-blue-800">
            <Link to="/signup" className="hover:underline">
              Sign up to see full project details and start tracking your own! →
            </Link>
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-blue-900 mb-4">
              Why Students Choose ProjTrackr
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'Secure authentication with Supabase to protect your portfolio',
              'Smart URL validation for Vibe Code and GitHub links',
              'Multi-tag categorization (Personal, Academic, Case Comp, Client)',
              'Batch tracking for perfect semester organization',
              'Lightning-fast search and filter functionality',
              'Edit and delete projects anytime with one click',
              'Fully responsive design for desktop and mobile',
              'Clean, intuitive interface inspired by top SaaS tools',
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 group">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6">
            Ready to Track Your Wins?
          </h2>
          <p className="text-blue-100 mb-8 text-xl">
            Join thousands of students organizing their portfolios with ProjTrackr.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              Start Free – No Card Needed
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all"
            >
              Already Have an Account?
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Brand */}
            <div>
              <h3 className="text-white mb-4">ProjTrackr</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Built with ❤️ for students to showcase their wins.
              </p>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 className="text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#teaser" className="hover:text-white transition-colors">Features</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Pricing - Free Forever</a>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h4 className="text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    <Github className="w-4 h-4" />
                    GitHub Repo
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Secondary CTA */}
            <div>
              <h4 className="text-white mb-4">Get Started</h4>
              <div className="space-y-3">
                <Link
                  to="/signup"
                  className="block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-center text-sm"
                >
                  Sign Up Free
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-400 transition-colors text-center text-sm"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>
              © 2025 ProjTrackr – Built with ❤️ for Students | Powered by Supabase & Figma
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
