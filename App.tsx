import React, { useState, useCallback } from 'react';
import { FileUploader } from './components/FileUploader';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { Loader } from './components/Loader';
import { generateTranscriptFromFile } from './services/geminiService';
import { GithubIcon } from './components/icons/GithubIcon';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    // 100MB limit
    if (file.size > 100 * 1024 * 1024) { 
        setError('ファイルサイズが大きすぎます。100MB以下のファイルを選択してください。');
        return;
    }
    setSelectedFile(file);
    setError(null);
    setTranscript('');
  };

  const handleTranscription = useCallback(async () => {
    if (!selectedFile) {
      setError('文字起こしするビデオまたは音声ファイルを選択してください。');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTranscript('');

    try {
      const generatedTranscript = await generateTranscriptFromFile(selectedFile);
      setTranscript(generatedTranscript);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '文字起こし中に不明なエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);
  
  const handleClear = () => {
    setSelectedFile(null);
    setTranscript('');
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            動画・音声 文字起こし AI
          </h1>
          <p className="mt-2 text-lg text-gray-400">Gemini API を利用して動画や音声ファイルから音声を文字起こしします。</p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader />
              <p className="mt-4 text-lg text-gray-300 animate-pulse">AIがファイルを処理しています... これには数分かかる場合があります。</p>
            </div>
          ) : (
            <>
              {!transcript ? (
                 <FileUploader
                    onFileSelect={handleFileSelect}
                    onTranscription={handleTranscription}
                    file={selectedFile}
                    error={error}
                  />
              ) : (
                <TranscriptDisplay 
                  transcript={transcript} 
                  onClear={handleClear} 
                />
              )}
            </>
          )}
        </main>
        
        <footer className="text-center mt-8 text-gray-500">
            <a href="https://github.com/google-gemini-v2/gemini-video-transcriber-app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-blue-400 transition-colors">
                <GithubIcon className="w-5 h-5" />
                <span>GitHubで表示</span>
            </a>
        </footer>
      </div>
    </div>
  );
};

export default App;