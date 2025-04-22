"use client";

import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from '@/components/ui/Input';

export default function TestForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Scraper & AI</h1>
      
      <div className="space-y-4">
        <Input
          label="Portfolio URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter portfolio URL"
        />
        
        <Button
          onClick={handleTest}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Run Test'}
        </Button>
      </div>

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Scraped Data:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result.scrapedData, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium">AI Generated Resume:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
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