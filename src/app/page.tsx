'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Failed to evaluate text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Brand Coach</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="text" className="block text-sm font-medium mb-2">
              Enter text to evaluate:
            </label>
            <textarea
              id="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full min-h-[200px] p-3 border rounded-lg"
              placeholder="Paste your text here..."
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Evaluating...' : 'Evaluate'}
          </button>
        </form>

        {response && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Evaluation:</h2>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}