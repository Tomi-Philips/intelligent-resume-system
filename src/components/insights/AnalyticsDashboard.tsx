import React from 'react';
import { BarChart3, TrendingUp, Users, FileText, Target, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function AnalyticsDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Applications" 
          value="1,284" 
          change="+12.5%" 
          trend="up" 
          icon={<Users className="w-5 h-5" />} 
          color="blue"
        />
        <StatCard 
          title="Average AI Score" 
          value="78.4" 
          change="+5.2%" 
          trend="up" 
          icon={<Award className="w-5 h-5" />} 
          color="purple"
        />
        <StatCard 
          title="Conversion Rate" 
          value="24.2%" 
          change="-2.1%" 
          trend="down" 
          icon={<Target className="w-5 h-5" />} 
          color="emerald"
        />
        <StatCard 
          title="Processed Resumes" 
          value="942" 
          change="+18.7%" 
          trend="up" 
          icon={<FileText className="w-5 h-5" />} 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Trends</h3>
              <p className="text-slate-500 text-sm">Monthly application volume vs. hiring rate</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-900 border-none text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500/20">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end gap-4">
            {[40, 65, 45, 80, 55, 95].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out" 
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-slate-400 uppercase font-medium">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Skills Sidebar */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">In-Demand Skills</h3>
          <div className="space-y-6">
            <SkillMetric name="React.js" percentage={92} color="blue" />
            <SkillMetric name="TypeScript" percentage={85} color="indigo" />
            <SkillMetric name="Node.js" percentage={78} color="emerald" />
            <SkillMetric name="Python" percentage={65} color="amber" />
            <SkillMetric name="System Design" percentage={42} color="rose" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, trend, icon, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-500/10 text-blue-600',
    purple: 'bg-purple-500/10 text-purple-600',
    emerald: 'bg-emerald-500/10 text-emerald-600',
    amber: 'bg-amber-500/10 text-amber-600',
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h4>
      </div>
    </div>
  );
}

function SkillMetric({ name, percentage, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">{name}</span>
        <span className="text-slate-500">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorMap[color]} rounded-full transition-all duration-1000`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
