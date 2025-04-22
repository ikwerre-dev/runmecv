"use client";

import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from '@/components/ui/Input';

export default function TestForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [stages, setStages] = useState({
    scraping: { completed: false, error: null as string | null },
    resumeGeneration: { completed: false, error: null as string | null },
    portfolioAnalysis: { completed: false, error: null as string | null },
    pdfGeneration: { completed: false, error: null as string | null }
  });

  console.log(stages)

  const handleTest = async () => {
    setLoading(true);
    setStages({
      scraping: { completed: false, error: null },
      resumeGeneration: { completed: false, error: null },
      portfolioAnalysis: { completed: false, error: null },
      pdfGeneration: { completed: false, error: null }
    });

    try {
      const response = await fetch('/api/test-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      console.log(data);
      setResult(data);
      setStages(data.stages);
    } catch (error) {
      console.error('Test failed:', error);
      setStages({
        scraping: { completed: false, error: 'Failed to connect to server' },
        resumeGeneration: { completed: false, error: 'Failed to connect to server' },
        pdfGeneration: { completed: false, error: 'Failed to connect to server' },
        portfolioAnalysis: { completed: false, error: 'Failed to connect to server' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Portfolio Scraper</h1>

      <div className="space-y-4">
        <Input
          label="Portfolio URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter portfolio URL"
        />

        <Button onClick={handleTest} disabled={loading}>
          {loading ? 'Testing...' : 'Run Test'}
        </Button>
      </div>

      <div className="mt-6 text-black space-y-2">
        <div className={`p-3 rounded ${stages.scraping.completed ? 'bg-green-50' : 'bg-red-50'}`}>
          Scraping: {stages.scraping.completed ? '✅ Completed' : `❌ ${stages.scraping.error || 'In progress'}`}
        </div>
        <div className={`p-3 rounded ${stages.resumeGeneration.completed ? 'bg-green-50' : 'bg-red-50'}`}>
          Resume Generation: {stages.resumeGeneration.completed ? '✅ Completed' : `❌ ${stages.resumeGeneration.error || 'In progress'}`}
        </div>
        <div className={`p-3 rounded ${stages.portfolioAnalysis.completed ? 'bg-green-50' : 'bg-red-50'}`}>
          Portfolio Analysis: {stages.portfolioAnalysis.completed ? '✅ Completed' : `❌ ${stages.portfolioAnalysis.error || 'In progress'}`}
        </div>
        <div className={`p-3 rounded ${stages.pdfGeneration.completed ? 'bg-green-50' : 'bg-red-50'}`}>
          PDF Generation: {stages.pdfGeneration.completed ? '✅ Completed' : `❌ ${stages.pdfGeneration.error || 'In progress'}`}
        </div>
      </div>

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="space-y-4">
            {result.portfolioAnalysis && (
              <div>
                <h3 className="font-medium">Portfolio Analysis:</h3>
                <div className="bg-gray-100 p-4 text-black rounded text-sm">
                  <div className="mb-4">
                    <h4 className="font-semibold">Strengths:</h4>
                    <ul className="list-disc pl-5">
                      {result.portfolioAnalysis.strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold">Weaknesses:</h4>
                    <ul className="list-disc pl-5">
                      {result.portfolioAnalysis.weaknesses.map((weakness: string, index: number) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold">Missing Elements:</h4>
                    <ul className="list-disc pl-5">
                      {result.portfolioAnalysis.missing.map((missing: string, index: number) => (
                        <li key={index}>{missing}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold">Suggestions:</h4>
                    <ul className="list-disc pl-5">
                      {result.portfolioAnalysis.suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">Rating:</h4>
                    <p>{result.portfolioAnalysis.rating}/100</p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <h3 className="font-medium">Scraped Data:</h3>
              <pre className="bg-gray-100 p-4 text-black rounded text-sm overflow-auto">
                {JSON.stringify(result.scrapedData, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-medium">AI Generated Resume:</h3>
              <pre className="bg-gray-100 p-4 text-black rounded text-sm overflow-auto">
                {JSON.stringify(result.resumeContent, null, 2)}
              </pre>
            </div>


            {result.pdf && (
              <div>
                <h3 className="font-medium">Generated PDF:</h3>
                <iframe
                  src={`data:application/pdf;base64,${result.pdf}`}
                  width="100%"
                  height="600px"
                  className="border rounded"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}