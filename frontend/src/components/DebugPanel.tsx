import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Database, Network, MessageSquare, RefreshCw } from 'lucide-react';

export function DebugPanel() {
  const [stats, setStats] = useState({
    cases: 0,
    propositions: 0,
    relationships: 0,
    avgEmbeddingLength: 0
  });
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = (import.meta.env?.VITE_API_URL as string) || 'http://localhost:5000/api';

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [casesRes, propsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/cases`),
        fetch(`${API_BASE_URL}/propositions`)
      ]);

      const cases = await casesRes.json();
      const props = await propsRes.json();

      const avgLength = props.length > 0
        ? props.reduce((sum: number, p: any) => sum + (p.embedding?.length || 0), 0) / props.length
        : 0;

      setStats({
        cases: cases.length,
        propositions: props.length,
        avgEmbeddingLength: Math.round(avgLength)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const testChatEndpoint = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Test query',
          history: []
        })
      });

      if (response.ok) {
        alert('✅ Chat endpoint is working!');
      } else {
        alert(`❌ Chat endpoint returned ${response.status}`);
      }
    } catch (error: any) {
      alert(`❌ Chat endpoint error: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Status
          </CardTitle>
          <Button size="sm" variant="outline" onClick={fetchStats} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stats">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="test">Test APIs</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">Cases</p>
                <p className="text-2xl">{stats.cases}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">Propositions</p>
                <p className="text-2xl">{stats.propositions}</p>
              </div>
              <div className="p-3 border rounded-lg col-span-2">
                <p className="text-xs text-muted-foreground">Avg Embedding Dimension</p>
                <p className="text-2xl">{stats.avgEmbeddingLength}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {stats.avgEmbeddingLength > 0 ? 'Embeddings present' : 'No embeddings'}
                </Badge>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 pt-2">
              <p>• Graph visualization uses proposition relationships</p>
              <p>• Chat uses semantic search with embeddings</p>
              <p>• Each proposition should have an embedding vector</p>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-3">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`${API_BASE_URL}/cases`, '_blank')}
              >
                <Database className="h-4 w-4 mr-2" />
                Test GET /api/cases
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`${API_BASE_URL}/propositions`, '_blank')}
              >
                <Network className="h-4 w-4 mr-2" />
                Test GET /api/propositions
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={testChatEndpoint}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Test POST /api/chat
              </Button>
            </div>

            <div className="text-xs text-muted-foreground pt-2">
              <p className="mb-2">Expected results:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Cases & Propositions: JSON array</li>
                <li>Chat: Should return structured response</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
