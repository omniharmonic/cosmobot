'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { use } from 'react';

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${id}`);
        const data = await response.json();

        if (data.success) {
          setProfile(data.data.profile);
        } else {
          setError(data.error || 'Failed to load profile');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-12 h-12" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="terminal-window max-w-2xl">
          <h1 className="text-3xl font-bold mb-4 text-oc-red">Error</h1>
          <p className="text-terminal-fg-muted mb-6">{error || 'Profile not found'}</p>
          <Link href="/" className="btn btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const archetypeColors: Record<string, string> = {
    allies: 'archetype-allies',
    innovators: 'archetype-innovators',
    organizers: 'archetype-organizers',
    patrons: 'archetype-patrons',
  };

  const archetypeColor = archetypeColors[profile.primary_archetype] || 'oc-green';

  return (
    <div className="min-h-screen p-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-oc-green">●</span> Your Civic Identity
          </h1>
          <p className="text-xl text-terminal-fg-muted">
            {profile.name ? `Welcome, ${profile.name}!` : 'Welcome!'}
          </p>
        </div>

        {/* Archetype Card */}
        <div className="terminal-window mb-8">
          <div className="text-center mb-8">
            <div className={`archetype-badge archetype-badge-${profile.primary_archetype} text-lg inline-block mb-4`}>
              {profile.primary_archetype}
            </div>
            <div className="flex items-center justify-center gap-2 text-terminal-fg-muted">
              <span>Confidence:</span>
              <span className={`text-${archetypeColor} font-bold`}>
                {Math.round(profile.primary_confidence * 100)}%
              </span>
            </div>
          </div>

          {/* Summary */}
          {profile.onboarding_summary && (
            <div className="prose prose-invert max-w-none">
              <div className="text-terminal-fg whitespace-pre-wrap leading-relaxed">
                {profile.onboarding_summary}
              </div>
            </div>
          )}

          {profile.archetype_reasoning && !profile.onboarding_summary && (
            <div className="text-terminal-fg-muted">
              <p>{profile.archetype_reasoning}</p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="terminal-window mb-8">
          <h2 className="text-2xl font-bold mb-6 text-oc-green">Your Next Steps</h2>
          <div className="space-y-4">
            <div className="p-4 border border-terminal-border rounded-md">
              <h3 className="font-bold text-terminal-fg mb-2">Subscribe to Newsletter</h3>
              <p className="text-sm text-terminal-fg-muted mb-3">
                Stay updated with the latest from OpenCivics
              </p>
              <a href="https://opencivics.co/newsletter" target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm">
                Subscribe
              </a>
            </div>

            <div className="p-4 border border-terminal-border rounded-md">
              <h3 className="font-bold text-terminal-fg mb-2">Explore Resources</h3>
              <p className="text-sm text-terminal-fg-muted mb-3">
                Discover frameworks, patterns, and protocols
              </p>
              <a href="https://opencivics.co/commons" target="_blank" rel="noopener noreferrer" className="btn btn-secondary text-sm">
                Explore
              </a>
            </div>

            <div className="p-4 border border-terminal-border rounded-md">
              <h3 className="font-bold text-terminal-fg mb-2">Join the Community</h3>
              <p className="text-sm text-terminal-fg-muted mb-3">
                Connect with other civic innovators
              </p>
              <a href="https://opencivics.co/join" target="_blank" rel="noopener noreferrer" className="btn btn-secondary text-sm">
                Join
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn btn-ghost text-center">
            Return Home
          </Link>
          <Link href="/chat" className="btn btn-secondary text-center">
            Chat with AI Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
