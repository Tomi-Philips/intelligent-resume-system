import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BrainCircuit, Zap, Target, Users, ChevronRight, Star, Sparkles, ArrowUpRight, Shield, Clock, BarChart3, FileText } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#090A0F] to-[#0F1117] text-white selection:bg-blue-500/30 overflow-hidden relative font-sans antialiased">
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMG0tMjkgMGEyOSAyOSAwIDEgMCA1OCAwQTI5IDI5IDAgMSAwIDMwIDMweiIgc3Ryb2tlPSIjMjIyIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] bg-repeat opacity-5" />
        <div className="absolute top-0 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-blue-500/10 via-transparent to-transparent animate-pulse-slow" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-600/30 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-600/20 rounded-full blur-[140px] animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[150px]" />

      {/* Ultra Modern Navbar */}
      <nav className="border-b border-white/5 backdrop-blur-xl sticky top-4 z-50 mx-4 rounded-2xl bg-[#0A0C10]/80 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="font-bold text-white text-lg tracking-tight">H</span>
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">HireFlow</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Docs'].map((item) => (
              <Link key={item} href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
              Sign In
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 border-0 shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] transition-all duration-300 rounded-full px-5">
                Get Started
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced */}
      <main className="container mx-auto px-6 pt-24 pb-28 text-center relative z-10 max-w-7xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 text-blue-300 text-sm font-medium mb-8 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 fill-blue-400" />
          <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">HireFlow 1.0 is live</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1]">
          Hire the top 1% <br />
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 blur-2xl opacity-30" />
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient">
              in seconds.
            </span>
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Upload hundreds of resumes and let our AI instantly parse, extract skills, and rank candidates against your exact job requirements.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link href="/login">
            <Button size="lg" className="h-14 px-8 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all duration-300 hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] hover:-translate-y-1 rounded-xl font-semibold group">
              Start Screening Now
              <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="h-14 px-8 text-base border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm rounded-xl font-medium">
              Enter Dashboard
            </Button>
          </Link>
        </div>

        {/* Stats Preview */}
        <div className="flex justify-center gap-8 md:gap-16 mb-20">
          {[
            { value: '99%', label: 'Accuracy Rate', icon: Target },
            { value: '< 2s', label: 'Avg. Parsing Time', icon: Clock },
            { value: '10K+', label: 'Resumes Processed', icon: FileText },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                <stat.icon className="w-5 h-5 text-blue-400" />
                {stat.value}
              </div>
              <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Modernized App Preview */}
        <div className="relative mx-auto max-w-6xl group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#111318] to-[#0D0E12] backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="h-10 flex items-center gap-2 border-b border-white/10 px-4 bg-[#0A0B0E]/50">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="ml-4 text-xs text-slate-500 font-mono">dashboard.hireflow.ai/rankings</div>
            </div>
            <div className="p-6">
              {/* Improved mock UI */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="md:col-span-1 space-y-3">
                  <div className="h-10 rounded-lg bg-gradient-to-r from-blue-500/20 to-transparent border border-blue-500/20 flex items-center px-3">
                    <span className="text-xs text-blue-300">Filter Panel</span>
                  </div>
                  <div className="space-y-2">
                    {['All Candidates', 'Shortlisted', 'Reviewed', 'Rejected'].map((filter) => (
                      <div key={filter} className="h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center px-3 cursor-pointer">
                        <span className="text-xs text-slate-400">{filter}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-3 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[95, 87, 76].map((score) => (
                      <div key={score} className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-slate-400">Match Score</span>
                          <span className="text-sm font-bold text-blue-400">{score}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-bold">JD</div>
                      <div>
                        <div className="text-sm font-medium">Senior Frontend Developer</div>
                        <div className="text-xs text-slate-500">Posted 2 days ago</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {['React', 'TypeScript', 'Next.js'].map((skill) => (
                        <span key={skill} className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/20">+{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid - Modernized */}
      <section id="features" className="relative z-10 py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C10] via-transparent to-[#0A0C10]" />
        <div className="container mx-auto px-6 max-w-7xl relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-medium text-blue-300 uppercase tracking-wider">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Everything you need to hire faster.
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Built for modern recruiting teams who demand efficiency and precision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Semantic Matching", desc: "We don't just look for keywords. The AI understands context, synonyms, and relevance.", icon: BrainCircuit, color: "from-blue-500 to-cyan-500", badge: "AI-Powered" },
              { title: "Instant Parsing", desc: "Drag and drop 100 PDFs and DOCX files. We extract structured data in milliseconds.", icon: Zap, color: "from-amber-500 to-orange-500", badge: "Lightning Fast" },
              { title: "Objective Scoring", desc: "Every candidate gets a 0-100 score based strictly on your job requirements and ideal profile.", icon: Target, color: "from-emerald-500 to-teal-500", badge: "Unbiased" },
              { title: "Candidate CRM", desc: "Manage your talent pipeline, leave notes, and track progress intuitively.", icon: Users, color: "from-purple-500 to-pink-500", badge: "Streamlined" },
            ].map((feature, i) => (
              <div key={i} className="group relative p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent hover:border-white/20 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${feature.color.split(' ')[1]}, transparent)` }} />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{feature.badge}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - New Addition */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="relative rounded-3xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-white/10 backdrop-blur-xl p-12 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/30 rounded-full blur-[80px]" />
            <div className="relative">
              <Star className="w-12 h-12 text-blue-400 mx-auto mb-6 fill-blue-400/20" />
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your hiring?</h3>
              <p className="text-slate-300 mb-8 max-w-md mx-auto">Join thousands of companies using HireFlow to find top talent faster.</p>
              <Link href="/login">
                <Button size="lg" className="bg-white text-black hover:bg-slate-100 rounded-full px-8 shadow-lg group">
                  Start Free Trial
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="relative z-10 border-t border-white/10 py-16 mt-10 bg-[#090A0F]/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-white text-sm">H</span>
                </div>
                <span className="font-bold text-lg tracking-tight">HireFlow</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs">Intelligent hiring platform that helps you find the perfect candidate in seconds.</p>
            </div>
            {['Product', 'Company', 'Resources'].map((section) => (
              <div key={section}>
                <h4 className="text-white text-sm font-semibold mb-4">{section}</h4>
                <ul className="space-y-2">
                  {['Overview', 'Features', 'Pricing'].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-slate-500 hover:text-white text-sm transition-colors">{item}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-slate-600 text-sm">
            <p>© 2026 HireFlow. Built for the future of hiring. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}