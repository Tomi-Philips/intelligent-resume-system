'use client';

import React from 'react';
import { HelpCircle, BookOpen, MessageCircle, FileText, Search, ExternalLink, PlayCircle, LifeBuoy } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function HelpPage() {
  const faqs = [
    {
      question: "How does the AI scoring work?",
      answer: "Our AI analyzes the resume content against the job description, looking for key skills, experience depth, and semantic matches. It assigns a score from 0-100 based on these factors."
    },
    {
      question: "Can I export candidate data?",
      answer: "Yes, you can export candidate lists and reports in PDF, CSV, and JSON formats from the Reports page."
    },
    {
      question: "How do I integrate with our ATS?",
      answer: "We currently support direct integrations with Greenhouse and Lever. Contact our support team for custom API access."
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3">
          <LifeBuoy className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Knowledge Base & Support</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          How can we help you today?
        </h1>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search for guides, FAQs, and more..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl shadow-blue-500/5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-lg"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HelpCard 
          icon={<BookOpen className="w-6 h-6" />} 
          title="User Guides" 
          description="Step-by-step instructions for every feature."
          color="blue"
        />
        <HelpCard 
          icon={<PlayCircle className="w-6 h-6" />} 
          title="Video Tutorials" 
          description="Visual walkthroughs of the platform."
          color="purple"
        />
        <HelpCard 
          icon={<FileText className="w-6 h-6" />} 
          title="API Docs" 
          description="Technical documentation for developers."
          color="emerald"
        />
      </div>

      {/* FAQs */}
      <div className="space-y-8 pb-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        <div className="grid gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HelpCard({ icon, title, description, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  };

  return (
    <div className="group p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        {description}
      </p>
      <button className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:gap-3 transition-all">
        Learn more <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
}
