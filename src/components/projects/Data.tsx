// File: Data.tsx

import Image from 'next/image';
import { ChevronRight, ExternalLink, Github } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// --- TYPES ---
type ProjectImage = {
  src: string;
  alt: string;
};

type ProjectLink = {
  name: string;
  url: string;
};

type Project = {
  title: string;
  description: string;
  techStack: string[];
  date: string;
  links: ProjectLink[];
  images: ProjectImage[];
  liveUrl?: string;
};

// --- PROJECT DATABASE ---
// This array holds the detailed information for each project.
const PROJECT_CONTENT: Project[] = [
  {
    title: 'ResumeBoost AI (OptimAIzer)',
    description:
      'Cloud-native application that transforms resumes into job-winning masterpieces by combining AI-driven PDF parsing, job description scraping, and tailored analysis—all powered by AWS cloud services. Uses GPT-4 API for intelligent optimization, Lambda Functions for serverless processing, and S3 for scalable storage.',
    techStack: [
      'AWS Lambda',
      'OpenAI GPT-4 API',
      'Python',
      'Flask',
      'API Gateway',
      'AWS S3',
      'Streamlit',
      'PDF Parsing',
      'Web Scraping',
      'Serverless Architecture',
    ],
    date: 'December 2024',
    links: [
      {
        name: 'Live Demo',
        url: 'https://saiganesh02.github.io/OptimAIzer/',
      },
      {
        name: 'GitHub Repository',
        url: 'https://github.com/SAIGANESH02/OptimAIzer',
      },
    ],
    images: [],
    liveUrl: 'https://saiganesh02.github.io/OptimAIzer/',
  },
  {
    title: 'Same Same Collective Chatbot',
    description:
      'AI-powered mental health chatbot tailored for LGBTQI+ youth in South Africa and Zimbabwe. Achieved 86% suicidal message detection accuracy using fine-tuned BERT model. Features automated empathetic responses, real-time alert systems for high-risk users, and emotion classification for appropriate mental health support.',
    techStack: [
      'Python',
      'BERT',
      'Fine-tuning',
      'NLP',
      'Deep Learning',
      'TensorFlow',
      'Logistic Regression',
      'Emotion Classification',
      'Mental Health AI',
    ],
    date: 'November 2024',
    links: [
      {
        name: 'GitHub Repository',
        url: 'https://github.com/SAIGANESH02/ChatbotPracticum',
      },
      {
        name: 'Project Details',
        url: 'https://github.com/SAIGANESH02/ChatbotPracticum',
      },
    ],
    images: [],
    liveUrl: 'https://github.com/SAIGANESH02/ChatbotPracticum',
  },
  {
    title: 'Indian Sign Language Recognition System',
    description:
      'Real-time chat system integrating ISL into e-Governance for accessible services for deaf individuals. Developed Python scripts using OpenCV & MediaPipe Holistic for pose/hand detection with keyframe selection. Enhanced Computer Vision accuracy by modifying Inception-ResNet, boosting detection precision by 20% and reducing false positives by 15%.',
    techStack: [
      'Python',
      'OpenCV',
      'MediaPipe Holistic',
      'Inception-ResNet',
      'Computer Vision',
      'Deep Learning',
      'Real-time Processing',
      'Gesture Recognition',
    ],
    date: 'October 2024',
    links: [
      {
        name: 'GitHub Repository',
        url: 'https://github.com/SAIGANESH02/ISL-Recognition',
      },
    ],
    images: [],
    liveUrl: 'https://github.com/SAIGANESH02/ISL-Recognition',
  },
  {
    title: 'Vision with Lost Glasses',
    description:
      'Computer vision project modeling how the brain processes noisy visual input. Simulates recognition in poor quality conditions (blur, low contrast) similar to lost glasses or foggy environments. Explores neural processing and pattern recognition with degraded visual information.',
    techStack: [
      'Python',
      'Computer Vision',
      'Neural Networks',
      'Image Processing',
      'OpenCV',
      'Deep Learning',
      'TensorFlow',
    ],
    date: 'September 2023',
    links: [
      {
        name: 'Live Demo',
        url: 'https://saiganesh02.github.io/Vision_with_Lost_Glasses',
      },
      {
        name: 'GitHub Repository',
        url: 'https://github.com/SAIGANESH02/Vision_with_Lost_Glasses',
      },
    ],
    images: [],
    liveUrl: 'https://saiganesh02.github.io/Vision_with_Lost_Glasses',
  },
  {
    title: 'Brain Functional Connectivity Analysis',
    description:
      'Analyzed HCP fMRI dataset to maintain Brain Functional Connectivity (BFC) during gambling tasks. Identified brain regions and networks affected by Win and Loss events. Used preprocessed HCP data to analyze connectivity and correlation of brain areas involved in decision-making tasks.',
    techStack: [
      'Python',
      'fMRI Analysis',
      'Neuroscience',
      'Data Analysis',
      'HCP Dataset',
      'Brain Connectivity',
      'Machine Learning',
    ],
    date: 'August 2023',
    links: [
      {
        name: 'Live Demo',
        url: 'https://saiganesh02.github.io/Predicting-the-decision-based-on-BFC/',
      },
      {
        name: 'GitHub Repository',
        url: 'https://github.com/SAIGANESH02/Predicting-the-decision-based-on-BFC',
      },
    ],
    images: [],
    liveUrl: 'https://saiganesh02.github.io/Predicting-the-decision-based-on-BFC/',
  },
  {
    title: 'DeepFakes Generation Using DCGAN',
    description:
      'Deep learning project for generating deepfakes using DCGAN (Deep Convolutional GAN) architecture. Explores face forensics and synthesis techniques for identity transformation in images and videos. Addresses the growing challenge of deepfake detection and generation.',
    techStack: [
      'Python',
      'TensorFlow',
      'Keras',
      'DCGAN',
      'GAN',
      'Deep Learning',
      'Computer Vision',
      'Face Synthesis',
    ],
    date: 'July 2023',
    links: [
      {
        name: 'Live Demo',
        url: 'https://saiganesh02.github.io/DeepFakes-Generation-Using-Deep-Learning/',
      },
      {
        name: 'GitHub Repository',
        url: 'https://github.com/SAIGANESH02/DeepFakes-Generation-Using-Deep-Learning',
      },
    ],
    images: [],
    liveUrl: 'https://saiganesh02.github.io/DeepFakes-Generation-Using-Deep-Learning/',
  },
  {
    title: 'Ethereum Price Time Series Forecasting',
    description:
      'Machine learning-based time series analysis to predict Ethereum cryptocurrency market price and stability. Implemented multiple forecasting models including LSTM, Moving Averages, ARIMA, and Facebook Prophet to analyze and predict future price fluctuations in the crypto market.',
    techStack: [
      'Python',
      'LSTM',
      'ARIMA',
      'Facebook Prophet',
      'Time Series Analysis',
      'Deep Learning',
      'TensorFlow',
      'Pandas',
      'NumPy',
    ],
    date: 'June 2023',
    links: [
      {
        name: 'Live Demo',
        url: 'https://saiganesh02.github.io/Time-Series-Forecasting-based-on-Ethereum-Prices/',
      },
      {
        name: 'GitHub Repository',
        url: 'https://github.com/SAIGANESH02/Time-Series-Forecasting-based-on-Ethereum-Prices',
      },
    ],
    images: [],
    liveUrl:
      'https://saiganesh02.github.io/Time-Series-Forecasting-based-on-Ethereum-Prices/',
  },
  {
    title: 'Super Mario RL Agent (DDQN)',
    description:
      'Reinforcement Learning agent using Double Deep Q-Network (DDQN) algorithm to play Super Mario Bros. Implemented with PyTorch library, combining Q-learning with deep neural networks to create an intelligent agent capable of completing game levels autonomously.',
    techStack: [
      'Python',
      'PyTorch',
      'Reinforcement Learning',
      'DDQN',
      'Q-Learning',
      'Deep Learning',
      'OpenAI Gym',
      'Game AI',
    ],
    date: 'May 2023',
    links: [
      {
        name: 'Live Demo',
        url: 'https://saiganesh02.github.io/Super-Mario-Playing-Agent-Using-RL/',
      },
      {
        name: 'GitHub Repository',
        url: 'https://github.com/SAIGANESH02/Super-Mario-Playing-Agent-Using-RL',
      },
    ],
    images: [],
    liveUrl: 'https://saiganesh02.github.io/Super-Mario-Playing-Agent-Using-RL/',
  },
  {
    title: 'Question Answering System (Splinter & SpanBERT)',
    description:
      'NLP-based Question Answering system using Splinter and SpanBERT models for both closed and open domain QA. Trained on SQuAD 2.0 dataset for open domain and custom COVID dataset for closed domain. Demonstrates state-of-the-art performance in extractive question answering.',
    techStack: [
      'Python',
      'Splinter',
      'SpanBERT',
      'BERT',
      'NLP',
      'Transformers',
      'SQuAD 2.0',
      'Deep Learning',
      'Hugging Face',
    ],
    date: 'April 2023',
    links: [
      {
        name: 'Live Demo',
        url: 'https://saiganesh02.github.io/QUESTION-ANSWERING-SYSTEM/',
      },
      {
        name: 'GitHub Repository',
        url: 'https://github.com/SAIGANESH02/QUESTION-ANSWERING-SYSTEM',
      },
    ],
    images: [],
    liveUrl: 'https://saiganesh02.github.io/QUESTION-ANSWERING-SYSTEM/',
  },
  {
    title: 'Speech Recognition with HMM',
    description:
      'Speech word recognition system using Hidden Markov Models (HMM). Trains one HMM per recognizable word using labeled training data. Classification performed by passing audio features to each model and selecting the best match based on likelihood scores.',
    techStack: [
      'Python',
      'Hidden Markov Models',
      'Speech Recognition',
      'Signal Processing',
      'Machine Learning',
      'Audio Processing',
      'Pattern Recognition',
    ],
    date: 'March 2023',
    links: [
      {
        name: 'Live Demo',
        url: 'https://saiganesh02.github.io/Speech-Recognition-with-HMM/',
      },
      {
        name: 'GitHub Repository',
        url: 'https://github.com/SAIGANESH02/Speech-Recognition-with-HMM',
      },
    ],
    images: [],
    liveUrl: 'https://saiganesh02.github.io/Speech-Recognition-with-HMM/',
  },
  {
    title: 'ChatZ - Decentralized Chat App',
    description:
      'Ethereum-powered decentralized messaging application addressing privacy and security concerns in traditional chat platforms. Uses blockchain as an immutable ledger and peer-to-peer networks to eliminate central node failure risks and ensure secure, private communication.',
    techStack: [
      'Ethereum',
      'Blockchain',
      'Solidity',
      'Web3.js',
      'React',
      'JavaScript',
      'Smart Contracts',
      'Decentralized Apps',
    ],
    date: 'February 2023',
    links: [
      {
        name: 'Live Demo',
        url: 'https://saiganesh02.github.io/ChatZ/',
      },
      {
        name: 'GitHub Repository',
        url: 'https://github.com/SAIGANESH02/ChatZ',
      },
    ],
    images: [],
    liveUrl: 'https://saiganesh02.github.io/ChatZ/',
  },
  {
    title: 'Object Detection using YOLO-V4',
    description:
      'Real-time object detection system on images, videos, and webcam feeds using TensorFlow-YOLOv4. Leverages deep learning for semantic feature extraction with improved network architecture, training strategy, and optimization compared to traditional approaches.',
    techStack: [
      'Python',
      'TensorFlow',
      'YOLO-V4',
      'Computer Vision',
      'Deep Learning',
      'Object Detection',
      'OpenCV',
      'Real-time Processing',
    ],
    date: 'January 2023',
    links: [
      {
        name: 'Live Demo',
        url: 'https://saiganesh02.github.io/Object-Detection-using-YOLO-V4/',
      },
      {
        name: 'GitHub Repository',
        url: 'https://github.com/SAIGANESH02/Object-Detection-using-YOLO-V4',
      },
    ],
    images: [],
    liveUrl: 'https://saiganesh02.github.io/Object-Detection-using-YOLO-V4/',
  },
];

// --- COMPONENT & INTERFACE DEFINITIONS ---
interface ProjectProps {
  title: string;
}

// This component dynamically renders the project details
const ProjectContent = ({ project }: { project: ProjectProps }) => {
  const projectData = PROJECT_CONTENT.find((p) => p.title === project.title);

  if (!projectData) {
    return <div>Project details not available</div>;
  }

  return (
    <div className="space-y-10">
      {/* Header section with description */}
      <div className="rounded-3xl bg-[#F5F5F7] p-8 dark:bg-[#1D1D1F]">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{projectData.date}</span>
          </div>

          <p className="font-sans text-base leading-relaxed text-secondary-foreground md:text-lg">
            {projectData.description}
          </p>

          {/* Tech stack */}
          <div className="pt-4">
            <h3 className="mb-3 text-sm tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {projectData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Links section */}
      {projectData.links && projectData.links.length > 0 && (
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-2 px-6">
            <h3 className="text-sm tracking-wide text-neutral-500 dark:text-neutral-400">
              Project Links
            </h3>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            {projectData.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl bg-[#F5F5F7] p-4 transition-colors hover:bg-[#E5E5E7] dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                <div className="flex items-center gap-3">
                  {link.name.includes('GitHub') ? (
                    <Github className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                  ) : (
                    <ExternalLink className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                  )}
                  <span className="font-medium">{link.name}</span>
                </div>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Live Preview Section */}
      {projectData.liveUrl && (
        <div className="space-y-4">
          <div className="mb-4 flex items-center gap-2 px-6">
            <h3 className="text-sm tracking-wide text-neutral-500 dark:text-neutral-400">
              Live Preview
            </h3>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
            <iframe
              src={projectData.liveUrl}
              className="h-full w-full border-0"
              title={`${projectData.title} Preview`}
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Images gallery (if any) */}
      {projectData.images && projectData.images.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {projectData.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video overflow-hidden rounded-2xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN DATA EXPORT ---
export const data = [
  {
    category: 'AI & Cloud',
    title: 'ResumeBoost AI (OptimAIzer)',
    src: 'https://saiganesh02.github.io/OptimAIzer/',
    content: <ProjectContent project={{ title: 'ResumeBoost AI (OptimAIzer)' }} />,
  },
  {
    category: 'AI & Mental Health',
    title: 'Same Same Collective Chatbot',
    src: 'https://github.com/SAIGANESH02/ChatbotPracticum',
    content: <ProjectContent project={{ title: 'Same Same Collective Chatbot' }} />,
  },
  {
    category: 'Computer Vision & Accessibility',
    title: 'Indian Sign Language Recognition System',
    src: 'https://github.com/SAIGANESH02/ISL-Recognition',
    content: (
      <ProjectContent
        project={{ title: 'Indian Sign Language Recognition System' }}
      />
    ),
  },
  {
    category: 'Computer Vision & Neuroscience',
    title: 'Vision with Lost Glasses',
    src: 'https://saiganesh02.github.io/Vision_with_Lost_Glasses',
    content: <ProjectContent project={{ title: 'Vision with Lost Glasses' }} />,
  },
  {
    category: 'Neuroscience & fMRI',
    title: 'Brain Functional Connectivity Analysis',
    src: 'https://saiganesh02.github.io/Predicting-the-decision-based-on-BFC/',
    content: (
      <ProjectContent project={{ title: 'Brain Functional Connectivity Analysis' }} />
    ),
  },
  {
    category: 'Deep Learning & GANs',
    title: 'DeepFakes Generation Using DCGAN',
    src: 'https://saiganesh02.github.io/DeepFakes-Generation-Using-Deep-Learning/',
    content: (
      <ProjectContent project={{ title: 'DeepFakes Generation Using DCGAN' }} />
    ),
  },
  {
    category: 'Time Series & Crypto',
    title: 'Ethereum Price Time Series Forecasting',
    src: 'https://saiganesh02.github.io/Time-Series-Forecasting-based-on-Ethereum-Prices/',
    content: (
      <ProjectContent
        project={{ title: 'Ethereum Price Time Series Forecasting' }}
      />
    ),
  },
  {
    category: 'Reinforcement Learning',
    title: 'Super Mario RL Agent (DDQN)',
    src: 'https://saiganesh02.github.io/Super-Mario-Playing-Agent-Using-RL/',
    content: <ProjectContent project={{ title: 'Super Mario RL Agent (DDQN)' }} />,
  },
  {
    category: 'NLP & Question Answering',
    title: 'Question Answering System (Splinter & SpanBERT)',
    src: 'https://saiganesh02.github.io/QUESTION-ANSWERING-SYSTEM/',
    content: (
      <ProjectContent
        project={{ title: 'Question Answering System (Splinter & SpanBERT)' }}
      />
    ),
  },
  {
    category: 'Speech Recognition',
    title: 'Speech Recognition with HMM',
    src: 'https://saiganesh02.github.io/Speech-Recognition-with-HMM/',
    content: <ProjectContent project={{ title: 'Speech Recognition with HMM' }} />,
  },
  {
    category: 'Blockchain & Web3',
    title: 'ChatZ - Decentralized Chat App',
    src: 'https://saiganesh02.github.io/ChatZ/',
    content: <ProjectContent project={{ title: 'ChatZ - Decentralized Chat App' }} />,
  },
  {
    category: 'Computer Vision & Detection',
    title: 'Object Detection using YOLO-V4',
    src: 'https://saiganesh02.github.io/Object-Detection-using-YOLO-V4/',
    content: <ProjectContent project={{ title: 'Object Detection using YOLO-V4' }} />,
  },
];
