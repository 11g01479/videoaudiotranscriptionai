
import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';

interface TranscriptDisplayProps {
  transcript: string;
  onClear: () => void;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript, onClear }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-200">文字起こし結果</h2>
      <div className="relative w-full">
        <textarea
          readOnly
          value={transcript}
          className="w-full h-80 p-4 bg-gray-900 border border-gray-700 rounded-lg resize-y text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="文字起こし結果がここに表示されます..."
        />
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 bg-gray-700 rounded-lg text-gray-400 hover:bg-gray-600 hover:text-white transition-all"
        >
            {copied ? (
                <span className="text-sm px-1">コピー完了!</span>
            ) : (
                <CopyIcon className="w-5 h-5" />
            )}
        </button>
      </div>
      <button
        onClick={onClear}
        className="mt-6 w-full max-w-xs mx-auto bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
      >
        別のファイルを試す
      </button>
    </div>
  );
};
