
import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { VideoIcon } from './icons/VideoIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { AudioIcon } from './icons/AudioIcon';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onTranscription: () => void;
  file: File | null;
  error: string | null;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, onTranscription, file, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  
  const removeFile = () => {
    onFileSelect(new File([], '')); // Effectively clears the file
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }


  return (
    <div className="flex flex-col items-center">
      {!file || file.size === 0 ? (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-all duration-300 ${isDragging ? 'border-blue-400 bg-blue-900/30 scale-105' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="video/*,audio/*"
          />
          <UploadIcon className="w-12 h-12 text-gray-500 mb-4" />
          <p className="text-gray-300 font-semibold">ここに動画・音声ファイルをドラッグ＆ドロップ</p>
          <p className="text-gray-400">またはクリックしてファイルを選択</p>
          <p className="text-xs text-gray-500 mt-2">最大ファイルサイズ: 100MB</p>
        </div>
      ) : (
        <div className="w-full bg-gray-700/50 rounded-lg p-6 text-center">
            <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-4 text-left">
                    { file.type.startsWith('audio/') ? 
                        <AudioIcon className="w-10 h-10 text-blue-400 flex-shrink-0" /> : 
                        <VideoIcon className="w-10 h-10 text-blue-400 flex-shrink-0" />
                    }
                    <div>
                        <p className="font-semibold text-gray-200 truncate max-w-xs sm:max-w-sm">{file.name}</p>
                        <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
                    </div>
                </div>
                <button onClick={removeFile} className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
                    <XCircleIcon className="w-6 h-6" />
                </button>
            </div>
            <button
                onClick={onTranscription}
                className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
            >
                文字起こしを開始
            </button>
        </div>
      )}
       {error && <p className="mt-4 text-red-400 bg-red-900/50 px-4 py-2 rounded-lg">{error}</p>}
    </div>
  );
};
