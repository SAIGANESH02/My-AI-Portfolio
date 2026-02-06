'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, ZoomIn, FileText, ExternalLink, Calendar, FileCheck } from 'lucide-react';

export function Resume() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const resumeDetails = {
    title: "Sai Ganesh Nellore's Resume",
    description: 'Lead ML Engineer | AI/ML Systems | Voice AI & LLM Optimization',
    fileType: 'PDF',
    lastUpdated: 'February 2025',
    fileSize: '145 KB',
    downloadUrl: '/SaiGanesh_Nellore_Resume_Feb.pdf',
    fileName: 'SaiGanesh-Nellore-Resume.pdf',
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = resumeDetails.downloadUrl;
    link.download = resumeDetails.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Reset downloading state after animation
    setTimeout(() => setIsDownloading(false), 1000);
  };

  return (
    <div className="mx-auto w-full max-w-5xl py-8 font-sans">
      <motion.div
        className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Resume</h2>
                <p className="text-sm text-blue-100">Professional Experience & Skills</p>
              </div>
            </div>
            <motion.button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-blue-600 font-medium hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDownloading ? (
                <>
                  <motion.div
                    className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <span className="hidden sm:inline">Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Resume PDF Preview */}
        <div 
          className="relative cursor-pointer group"
          onClick={() => setIsPreviewOpen(true)}
        >
          <div className="relative w-full bg-white dark:bg-gray-950">
            <iframe
              src={`${resumeDetails.downloadUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-[600px] border-0"
              title="Resume Preview"
            />
            {/* Hover overlay with better gradient */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.div 
                className="flex items-center gap-3 text-white bg-black/70 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                whileHover={{ scale: 1 }}
              >
                <ZoomIn className="h-5 w-5" />
                <span className="font-semibold">Click to view fullscreen</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Details area with improved styling */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-1">
                {resumeDetails.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {resumeDetails.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                  <FileCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">{resumeDetails.fileType}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                  <Calendar className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  <span className="font-medium">Updated {resumeDetails.lastUpdated}</span>
                </span>
                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full font-medium">
                  {resumeDetails.fileSize}
                </span>
              </div>
            </div>
          </div>

          {/* Action links with improved styling */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
            <motion.a
              href={resumeDetails.downloadUrl}
              download={resumeDetails.fileName}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </motion.a>
            <motion.a
              href={resumeDetails.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-950 rounded-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ExternalLink className="h-4 w-4" />
              Open in new tab
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Enhanced full screen preview modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPreviewOpen(false)}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all shadow-xl backdrop-blur-md"
              onClick={() => setIsPreviewOpen(false)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-6 w-6" />
            </motion.button>
            
            {/* PDF viewer */}
            <motion.div
              className="w-full max-w-5xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={resumeDetails.downloadUrl}
                className="w-full h-full border-0"
                title="Resume Full Preview"
              />
            </motion.div>

            {/* Enhanced download button in modal */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              disabled={isDownloading}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-2xl hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDownloading ? (
                <>
                  <motion.div
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Download Resume
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Resume;