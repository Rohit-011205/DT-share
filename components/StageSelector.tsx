import React from 'react';
import { EducationStage } from '../types';
import { GraduationCap, School, BookOpen, ArrowRight, Star } from 'lucide-react';

interface StageSelectorProps {
  onSelect: (stage: EducationStage) => void;
}

const StageSelector: React.FC<StageSelectorProps> = ({ onSelect }) => {
  const stages = [
    {
      id: EducationStage.CLASS_10,
      label: "Class 10",
      sub: "Stream Selection",
      icon: <School className="w-8 h-8 text-white" />,
      color: "bg-blue-500",
      hoverColor: "hover:border-blue-300 hover:shadow-blue-200",
      desc: "Confused between Science, Commerce, or Arts? We help you analyze your strengths."
    },
    {
      id: EducationStage.CLASS_12,
      label: "Class 12",
      sub: "College & Courses",
      icon: <BookOpen className="w-8 h-8 text-white" />,
      color: "bg-teal-500",
      hoverColor: "hover:border-teal-300 hover:shadow-teal-200",
      desc: "Targeting JEE, NEET, or CUET? Let's shortlist the best colleges and courses for you."
    },
    {
      id: EducationStage.UNDERGRAD,
      label: "Undergraduate",
      sub: "Job Market Ready",
      icon: <GraduationCap className="w-8 h-8 text-white" />,
      color: "bg-indigo-500",
      hoverColor: "hover:border-indigo-300 hover:shadow-indigo-200",
      desc: "Building your resume? Find high-paying career paths, internships, and skills."
    }
  ];

  return (
    <div className="min-h-full bg-gray-50 flex flex-col items-center justify-center p-6 md:p-12">
      <div className="max-w-5xl w-full space-y-12">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm mb-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">AI-Powered Career Counselor</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            EDGO <span className="text-teal-600">AI</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Personalized guidance for Indian students. Select your education stage to begin your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stages.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`group relative flex flex-col items-start p-8 bg-white rounded-3xl shadow-sm border-2 border-transparent transition-all duration-300 ${item.hoverColor} hover:shadow-xl hover:-translate-y-1`}
            >
              <div className={`mb-6 p-4 rounded-2xl shadow-md ${item.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              
              <div className="space-y-2 mb-4 w-full text-left">
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider rounded-md">
                  {item.sub}
                </span>
                <h3 className="text-2xl font-bold text-gray-800">{item.label}</h3>
              </div>
              
              <p className="text-sm text-gray-500 leading-relaxed text-left mb-8">
                {item.desc}
              </p>

              <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:gap-3 transition-all">
                Start Session <ArrowRight size={16} className="group-hover:text-teal-600" />
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StageSelector;