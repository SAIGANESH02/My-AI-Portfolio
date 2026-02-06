"use client";
import { data } from "@/components/projects/Data";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, 
  ExternalLink, 
  Play, 
  Search, 
  Code, 
  Sparkles, 
  TrendingUp,
  Eye,
  Star,
  X,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

export default function AllProjects() {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "featured">("grid");

  // Extract unique categories
  const categories = ["all", ...new Set(data.map((card) => card.category))];

  // Filter projects
  const filteredData = data.filter((card) => {
    const matchesCategory = filter === "all" || card.category === filter;
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Project stats
  const stats = [
    { icon: Code, label: "Total Projects", value: data.length, color: "text-emerald-600 dark:text-emerald-400" },
    { icon: Sparkles, label: "AI/ML Projects", value: data.filter(d => d.category.includes("AI") || d.category.includes("ML") || d.category.includes("NLP")).length, color: "text-purple-600 dark:text-purple-400" },
    { icon: TrendingUp, label: "Production Ready", value: data.filter(d => d.category.includes("AI") || d.category.includes("Full")).length, color: "text-blue-600 dark:text-blue-400" },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white dark:from-black dark:via-neutral-950 dark:to-black py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 space-y-6"
        >
          {/* Title with Animated Icon */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Code className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
          </div>

          {/* Description */}
          <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            A collection of <span className="font-bold text-blue-600 dark:text-blue-400">12+ AI/ML projects</span> spanning voice AI, computer vision, NLP,
            reinforcement learning, and blockchain. Each project demonstrates practical
            applications of cutting-edge technologies in production environments.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {stat.label}
                  </span>
                </div>
                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stat.value}+
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search & Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 space-y-6"
        >
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search projects by name or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all shadow-sm focus:shadow-lg"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === category
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-600 hover:scale-105"
                }`}
              >
                {category === "all" ? "All Projects" : category}
              </button>
            ))}
          </div>

          {/* Results Counter */}
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            Showing <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredData.length}</span> of {data.length} projects
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          <AnimatePresence mode="popLayout">
            {filteredData.map((project, index) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedProject(project)}
                className="group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border-2 border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-all hover:shadow-2xl hover:scale-105"
              >
                {/* Preview Image/Iframe */}
                <div className="relative aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden">
                  {project.src.startsWith('http') ? (
                    <div className="relative w-full h-full overflow-hidden">
                      <iframe
                        src={project.src}
                        className="absolute inset-0 w-full h-full pointer-events-none scale-[0.35] origin-top-left"
                        style={{ width: '285%', height: '285%' }}
                        title={project.title}
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-12 w-12 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                    <div className="flex items-center gap-2 text-white text-sm font-semibold">
                      <Eye className="h-4 w-4" />
                      <span>Click to view details</span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-black/95 text-neutral-900 dark:text-neutral-100 backdrop-blur-sm shadow-lg">
                      {project.category}
                    </span>
                  </div>

                  {/* Featured Badge (optional - add logic for featured projects) */}
                  {index < 3 && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4">
                    Explore this {project.category.toLowerCase()} project showcasing production-ready AI/ML implementations
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Details
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.src, '_blank');
                      }}
                      className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors shadow-sm hover:shadow-md"
                    >
                      <Github className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-700"
          >
            <Search className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              No projects found
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 rounded-3xl p-8 md:p-12 border border-blue-200 dark:border-blue-900 shadow-xl"
        >
          <div className="text-center space-y-6">
            <div className="inline-block">
              <Sparkles className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Want to know more about any specific project?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Ask me in the chat! I'd love to dive deeper into the technical details,
              architecture decisions, challenges faced, and solutions implemented.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="/chat?query=Tell me more about your AI/ML projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all"
              >
                <Sparkles className="h-5 w-5" />
                Ask me in the chat!
              </a>
              <a
                href="https://github.com/SAIGANESH02"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-2 border-neutral-200 dark:border-neutral-800 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all"
              >
                <Github className="h-5 w-5" />
                View on GitHub
              </a>
            </div>
          </div>
        </motion.div>

        {/* Info Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-900">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                Production Experience
              </h4>
            </div>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
              All projects showcase production-ready code with real-world applications.
              From voice AI serving 1000s daily to RAG systems saving $300K+.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-900">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100">
                Open Source & Live Demos
              </h4>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
              Most projects include GitHub repos and live demos. Click on any project card
              to explore code, architecture, and deployed applications.
            </p>
          </div>
        </motion.div>

        {/* Modal for Project Details */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl"
              >
                {/* Modal Header */}
                <div className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 px-8 py-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 mb-2">
                        {selectedProject.category}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                        {selectedProject.title}
                      </h2>
                    </div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="ml-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <X className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="prose dark:prose-invert max-w-none">
                    {selectedProject.content}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}