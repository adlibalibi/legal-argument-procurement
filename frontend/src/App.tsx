import { useState, useEffect } from 'react';
import { GraphView } from './components/GraphView';
import { Chatbot } from './components/Chatbot';
import { ConnectionStatus } from './components/ConnectionStatus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Network, MessageSquare, Scale } from 'lucide-react';
import { validateMockData } from './utils/testMockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'graph'>('chat');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // 🧩 Validate mock data and log environment check on mount
  useEffect(() => {
    console.log('🚀 App initialized. Running mock data validation...');
    validateMockData();

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    console.log(`🌐 Backend API base: ${apiBase}`);
  }, []);

  // 🔁 Handle Case Click from Chatbot → switch tab to GraphView
  const handleCaseClick = (caseId: string) => {
    console.log(`📂 Case selected: ${caseId}`);
    setSelectedCaseId(caseId);
    setActiveTab('graph');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ======================= HEADER ======================= */}
      <header className="border-b bg-gradient-to-r from-primary via-accent to-primary shadow-lg">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo + Title */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shadow-lg">
                <Scale className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-primary-foreground tracking-tight">
                  Legal Debate & Precedent Graph Platform
                </h1>
                <p className="text-sm text-primary-foreground/80">
                  Analyze precedents • Strengthen arguments • Navigate case law
                </p>
              </div>
            </div>

            {/* Connection Indicator */}
            <div className="flex items-center">
              <ConnectionStatus />
            </div>
          </div>
        </div>
      </header>

      {/* ======================= MAIN BODY ======================= */}
      <main className="container mx-auto px-4 py-6 flex-1">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'chat' | 'graph')} className="h-full flex flex-col">
          <TabsList className="grid w-full sm:w-1/2 lg:w-1/3 grid-cols-2 mb-4 mx-auto">
            <TabsTrigger value="graph" className="flex items-center justify-center gap-2 text-sm font-medium">
              <Network className="h-4 w-4" />
              Case Graph
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center justify-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              Debate Assistant
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 relative border rounded-2xl shadow-inner overflow-hidden">
            <TabsContent value="graph" className="h-full m-0">
              <GraphView selectedCaseId={selectedCaseId} />
            </TabsContent>

            <TabsContent value="chat" className="h-full m-0">
              <Chatbot onCaseClick={handleCaseClick} />
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* ======================= FOOTER ======================= */}
      <footer className="border-t text-center text-xs py-3 text-muted-foreground">
        © {new Date().getFullYear()} Legal Debate Graph Platform • Built for Explainable Legal Reasoning
      </footer>
    </div>
  );
}
