'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface QuizQuestion {
  id: string;
  type: string;
  text: string;
  description?: string;
  options?: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  validation?: {
    min_selections?: number;
    max_selections?: number;
  };
}

export default function QuizPage() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentResponse, setCurrentResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const startQuiz = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/quiz/start', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setProfileId(data.data.profile_id);
        setCurrentQuestion(data.data.first_question);
        setSessionStarted(true);
        setProgress(0);
      } else {
        setError(data.error || 'Failed to start quiz');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!profileId || !currentQuestion || currentResponse === null) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/quiz/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: profileId,
          question_id: currentQuestion.id,
          response_value: currentResponse,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save response
        setResponses(prev => ({ ...prev, [currentQuestion.id]: currentResponse }));

        // Update progress
        setProgress(data.data.progress_percentage);

        if (data.data.is_complete) {
          // Quiz is complete
          setIsComplete(true);
          completeQuiz();
        } else {
          // Move to next question
          setCurrentQuestion(data.data.next_question);
          setCurrentResponse(null);
        }
      } else {
        setError(data.error || 'Failed to save response');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const completeQuiz = async () => {
    if (!profileId) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/quiz/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileId }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to results page
        window.location.href = `/results/${profileId}`;
      } else {
        setError(data.error || 'Failed to complete quiz');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleOptionSelect = (value: string) => {
    if (currentQuestion?.type === 'multi_select') {
      const current = Array.isArray(currentResponse) ? currentResponse : [];
      if (current.includes(value)) {
        setCurrentResponse(current.filter((v: string) => v !== value));
      } else {
        setCurrentResponse([...current, value]);
      }
    } else {
      setCurrentResponse(value);
    }
  };

  const isValidResponse = () => {
    if (!currentQuestion || currentResponse === null || currentResponse === undefined) {
      return false;
    }

    if (currentQuestion.type === 'multi_select') {
      const selected = Array.isArray(currentResponse) ? currentResponse : [];
      const min = currentQuestion.validation?.min_selections || 0;
      const max = currentQuestion.validation?.max_selections || Infinity;
      return selected.length >= min && selected.length <= max;
    }

    if (currentQuestion.type === 'text' || currentQuestion.type === 'conversation') {
      return currentResponse.trim().length > 0;
    }

    return true;
  };

  if (!sessionStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="terminal-window">
            <h1 className="text-4xl font-bold mb-6 text-center">
              <span className="text-oc-green">●</span> OpenCivics Quiz
            </h1>
            <p className="text-lg text-terminal-fg-muted mb-8 text-center">
              Discover your unique role in building the future of civic innovation
            </p>
            <div className="space-y-4 mb-8">
              <p className="text-terminal-fg">This quiz will help us understand:</p>
              <ul className="list-disc list-inside space-y-2 text-terminal-fg-muted">
                <li>What resources you can contribute</li>
                <li>How you want to participate</li>
                <li>Your civic interests and passions</li>
                <li>Your skills and experience</li>
              </ul>
            </div>
            {error && (
              <div className="mb-4 p-4 border border-oc-red bg-oc-red/10 rounded-md">
                <p className="text-oc-red">{error}</p>
              </div>
            )}
            <button
              onClick={startQuiz}
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Starting...' : 'Begin Quiz →'}
            </button>
            <div className="mt-6 text-center">
              <Link href="/" className="text-oc-green hover:text-oc-blue">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="terminal-window">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-terminal-fg-muted font-mono">Progress</span>
              <span className="text-sm text-oc-green font-mono">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Question */}
          {currentQuestion && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-terminal-fg">
                {currentQuestion.text}
              </h2>
              {currentQuestion.description && (
                <p className="text-terminal-fg-muted mb-6">{currentQuestion.description}</p>
              )}

              {/* Single Select */}
              {currentQuestion.type === 'single_select' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleOptionSelect(option.value)}
                      className={`radio-option ${
                        currentResponse === option.value ? 'radio-option-selected' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-oc-green flex items-center justify-center">
                        {currentResponse === option.value && (
                          <div className="w-3 h-3 rounded-full bg-oc-green" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-mono text-terminal-fg">{option.label}</div>
                        {option.description && (
                          <div className="text-sm text-terminal-fg-muted mt-1">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Multi Select */}
              {currentQuestion.type === 'multi_select' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => {
                    const selected = Array.isArray(currentResponse) && currentResponse.includes(option.value);
                    return (
                      <div
                        key={option.value}
                        onClick={() => handleOptionSelect(option.value)}
                        className={`radio-option ${selected ? 'radio-option-selected' : ''}`}
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded border-2 border-oc-green flex items-center justify-center">
                          {selected && (
                            <div className="w-3 h-3 bg-oc-green" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-mono text-terminal-fg">{option.label}</div>
                          {option.description && (
                            <div className="text-sm text-terminal-fg-muted mt-1">
                              {option.description}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Text/Conversation */}
              {(currentQuestion.type === 'text' || currentQuestion.type === 'conversation') && (
                <textarea
                  value={currentResponse || ''}
                  onChange={(e) => setCurrentResponse(e.target.value)}
                  placeholder="Type your response..."
                  className="textarea min-h-[120px]"
                />
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-4 border border-oc-red bg-oc-red/10 rounded-md">
              <p className="text-oc-red">{error}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Link href="/" className="btn btn-ghost">
              Cancel
            </Link>
            <button
              onClick={submitResponse}
              disabled={!isValidResponse() || isLoading}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
