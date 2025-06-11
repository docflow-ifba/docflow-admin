import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, Brain, Sparkle } from 'lucide-react';
import Markdown from 'react-markdown';

type ThinkSectionProps = {
  content: string;
};

const ThinkSection = ({ content }: ThinkSectionProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="mt-2 mb-4">
      <button
        onClick={toggleVisibility}
        className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors mb-3 bg-primary/5 p-2 rounded-md"
      >
        <Sparkle className="w-4 h-4" /> Pensamento
        {isVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isVisible && (
        <div className="p-3 rounded-md bg-primary/5 border-l-4 border-primary/60 text-gray-600 text-sm font-medium">
          <Markdown>{content}</Markdown>
        </div>
      )}
    </div>
  );
};

export default ThinkSection;
