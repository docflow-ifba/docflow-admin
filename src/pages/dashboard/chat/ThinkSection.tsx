import { ChevronDown, ChevronUp, Sparkle } from 'lucide-react';
import { useState } from 'react';
import MarkdownRenderer from '../notices/MarkdownRenderer';

type ThinkSectionProps = {
  content: string;
};

const ThinkSection = ({ content }: ThinkSectionProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="mb-2">
      <button
        onClick={toggleVisibility}
        className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors mb-3 bg-primary/5 p-2 rounded-md"
      >
        <Sparkle className="w-4 h-4" /> Pensamento
        {isVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isVisible && (
        <div className="p-3 rounded-md bg-primary/5 border-l-4 border-primary/60 text-gray-600 text-sm font-medium">
          <MarkdownRenderer markdown={content} />
        </div>
      )}
    </div>
  );
};

export default ThinkSection;
