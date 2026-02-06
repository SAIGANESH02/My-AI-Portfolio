'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Code, Cpu, Database, Cloud } from 'lucide-react';

const Skills = () => {
  const skillsData = [
    {
      category: 'Programming Languages',
      icon: <Code className="h-5 w-5" />,
      skills: [
        'Python',
        'Java',
        'R',
        'MATLAB',
        'Git',
        'Scala',
        'JavaScript',
        'C/C++',
      ],
      color: 'bg-blue-50 text-blue-600 border border-blue-200',
    },
    {
      category: 'ML/AI Frameworks & Models',
      icon: <Cpu className="h-5 w-5" />,
      skills: [
        'LangChain',
        'TensorFlow',
        'PyTorch',
        'NumPy',
        'Pandas',
        'Python NLTK',
        'Scikit-learn',
        'OpenCV',
        'Keras',
        'ROS',
        'FastAPI',
        'LLM',
        'RAG',
        'GPT (ChatGPT, GPT-3.5, GPT-4)',
        'BERT',
        'RoBERTa',
        'T5',
        'Transformers',
        'CNN',
        'GAN',
        'U-Net',
        'ResNet',
        'YOLO-V4',
        'LSTM',
        'ARIMA',
        'RCNN',
        'Splinter',
        'Q-Learning',
        'DDQN',
        'Flask',
        'Decision Trees',
        'Clustering',
        'Regression',
        'Predictive Models',
        'Forecasting',
      ],
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    },
    {
      category: 'DevOps / MLOps / Cloud',
      icon: <Cloud className="h-5 w-5" />,
      skills: [
        'AWS',
        'Microsoft Azure',
        'Google Cloud Platform',
        'Docker',
        'Kubernetes',
        'CI/CD',
        'GitHub Actions',
        'Linux Bash',
        'Apache Spark',
        'Jenkins',
        'ETL',
        'MLflow',
        'DVC',
        'Dagshub',
        'Apache Airflow',
        'SageMaker',
        'Databricks',
        'LLMOps',
        'Version Control',
        'GCP',
        'Containerization',
        'Cloud Computing',
        'Kubeflow',
        'Cloud Technologies',
        'Cloud Infrastructure',
        'Websockets',
        'Web Services',
        'Microservices',
      ],
      color: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
    },
    {
      category: 'Databases / Big Data Technologies',
      icon: <Database className="h-5 w-5" />,
      skills: [
        'SQL',
        'NoSQL',
        'MongoDB',
        'Hadoop',
        'Spark (MLlib)',
        'PySpark',
        'Power BI',
        'BigQuery',
        'Snowflake',
        'Postgres',
      ],
      color: 'bg-amber-50 text-amber-600 border border-amber-200',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="mx-auto w-full max-w-5xl rounded-4xl"
    >
      <Card className="w-full border-none bg-transparent px-0 pb-12 text-black shadow-none dark:text-white">
        <CardHeader className="px-0 pb-1">
          <CardTitle className="text-primary px-0 text-4xl font-bold">
            Skills & Expertise
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          <motion.div
            className="space-y-8 px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skillsData.map((section, index) => (
              <motion.div
                key={index}
                className="space-y-3 px-0"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h3 className="text-accent-foreground text-lg font-semibold">
                    {section.category}
                  </h3>
                </div>

                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {section.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      variants={badgeVariants}
                      whileHover={{
                        scale: 1.04,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Badge className={`border px-3 py-1.5 font-normal`}>
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Skills;