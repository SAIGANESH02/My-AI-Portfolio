'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Linkedin, Github, MapPin, Globe } from 'lucide-react';

export function Contact() {
  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: 'Email',
      value: 'nsaiganesh2003@gmail.com',
      href: 'mailto:nsaiganesh2003@gmail.com',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: 'Phone',
      value: '+1 (773) 822-5301',
      href: 'tel:+17738225301',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: 'Location',
      value: 'Chicago, IL, USA',
      href: 'https://www.google.com/maps/place/Chicago,+IL',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      title: 'LinkedIn',
      value: 'saiganeshn',
      href: 'https://linkedin.com/in/saiganeshn',
      color: 'text-blue-700 dark:text-blue-500'
    },
    {
      icon: <Github className="h-5 w-5" />,
      title: 'GitHub',
      value: 'SAIGANESH02',
      href: 'https://github.com/SAIGANESH02',
      color: 'text-gray-800 dark:text-gray-300'
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: 'Portfolio',
      value: 'saiganesh02.github.io',
      href: 'https://saiganesh02.github.io/SaiGanesh02/',
      color: 'text-indigo-600 dark:text-indigo-400'
    },
    // {
    //   icon: <Twitter className="h-5 w-5" />,
    //   title: 'Twitter',
    //   value: '@saigane75831398',
    //   href: 'https://twitter.com/saigane75831398',
    //   color: 'text-sky-600 dark:text-sky-400'
    // },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Let's Connect
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          I'm always excited to discuss AI/ML innovations, collaborate on cutting-edge projects, 
          or explore opportunities in production-scale GenAI systems and LLM optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contactInfo.map((contact, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-blue-200 dark:hover:border-blue-800"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 ${contact.color}`}>
                  {contact.icon}
                </div>
                <CardTitle className="text-base font-semibold">{contact.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm font-medium mb-3 text-foreground/80">
                {contact.value}
              </CardDescription>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                onClick={() => window.open(contact.href, '_blank')}
              >
                {contact.title === 'Location' ? 'View on Map' : 
                 contact.title === 'Email' ? 'Send Email' :
                 contact.title === 'Phone' ? 'Call Now' :
                 `Visit ${contact.title}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 pt-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
            <h3 className="font-bold text-lg">What I'm Looking For</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              Lead ML Engineer / Senior AI Engineer roles
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              LLM optimization & RAG system projects
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              Production-scale AI/ML infrastructure
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              Open source contributions in AI/ML
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              Tech community collaborations
            </li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-green-600 dark:bg-green-400 rounded-full"></div>
            <h3 className="font-bold text-lg">Areas of Expertise</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
              Agentic Voice AI & STT/TTS Systems
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
              LLM Fine-tuning & Model Compression
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
              AWS Cloud Architecture (SageMaker, Bedrock)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
              HIPAA-Compliant AI Solutions
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
              Computer Vision & NLP Pipelines
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center bg-accent/50 rounded-xl p-6 border border-border">
        <p className="text-sm text-muted-foreground leading-relaxed">
          💡 <strong>Open to opportunities!</strong> Whether you're looking to discuss cutting-edge AI solutions, 
          explore collaboration on GenAI projects, or just want to connect about the latest in ML engineering—
          I'd love to hear from you. Let's build something impactful together!
        </p>
      </div>
    </div>
  );
}