import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <main className="max-w-4xl w-full">
        {/* Terminal Window */}
        <div className="terminal-window">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-oc-green">●</span> OpenCivics
            </h1>
            <p className="text-xl text-terminal-fg-muted font-mono">
              Intelligent Onboarding Assistant
            </p>
          </div>

          {/* Welcome Message */}
          <div className="space-y-6 mb-12">
            <p className="text-lg text-terminal-fg leading-relaxed">
              Welcome to OpenCivics — a movement to build participatory, vital, and resilient civic systems.
            </p>
            <p className="text-lg text-terminal-fg leading-relaxed">
              This intelligent onboarding assistant will help you discover your unique role in building
              the future of civic innovation.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/quiz" className="btn btn-primary text-center">
              Start Quiz
            </Link>
            <Link href="/chat" className="btn btn-secondary text-center">
              Explore with AI
            </Link>
          </div>

          {/* Info */}
          <div className="mt-12 pt-8 border-t border-terminal-border">
            <p className="text-sm text-terminal-fg-muted">
              The quiz takes about 5-7 minutes and will help us identify your participation archetype:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 border border-terminal-border rounded-md">
                <span className="archetype-badge archetype-badge-allies text-xs">Allies</span>
                <p className="text-sm text-terminal-fg-muted mt-2">Learners & Explorers</p>
              </div>
              <div className="p-4 border border-terminal-border rounded-md">
                <span className="archetype-badge archetype-badge-innovators text-xs">Innovators</span>
                <p className="text-sm text-terminal-fg-muted mt-2">Systems Builders</p>
              </div>
              <div className="p-4 border border-terminal-border rounded-md">
                <span className="archetype-badge archetype-badge-organizers text-xs">Organizers</span>
                <p className="text-sm text-terminal-fg-muted mt-2">Community Weavers</p>
              </div>
              <div className="p-4 border border-terminal-border rounded-md">
                <span className="archetype-badge archetype-badge-patrons text-xs">Patrons</span>
                <p className="text-sm text-terminal-fg-muted mt-2">Regenerative Stewards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-terminal-fg-muted font-mono">
            OpenCivics Onboarding v1.0 • Built with ❤️ for the civic commons
          </p>
        </div>
      </main>
    </div>
  );
}
