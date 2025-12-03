import { useState, useEffect, useCallback, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getGraphData, getCaseById, getAllCases, getCaseGraphData } from '../services/api';
import { ForceGraphData, Case } from '../types';
import { validateGraphData } from '../utils/graphValidation';
import { SearchBar } from './SearchBar';
import { CaseDetails } from './CaseDetails';
import { PropositionList } from './PropositionList';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Loader2, ZoomIn, ZoomOut, Maximize2, Network, Scale } from 'lucide-react';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface GraphViewProps {
  selectedCaseId?: string | null;
}

export function GraphView({ selectedCaseId }: GraphViewProps) {
  const [graphData, setGraphData] = useState<ForceGraphData>({ nodes: [], links: [] });
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [loading, setLoading] = useState(false);
  const [allCases, setAllCases] = useState<Case[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const graphRef = useRef<any>();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedCaseId) {
      loadCaseFromId(selectedCaseId);
    }
  }, [selectedCaseId]);

  const loadCaseFromId = async (caseId: string) => {
    setLoading(true);
    try {
      const caseData = await getCaseById(caseId);
      if (caseData) {
        setSelectedCase(caseData);
        await loadGraphForCase(caseId);
      }
    } catch (error) {
      console.error('Error loading case:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const cases = await getAllCases();
      setAllCases(cases);
      
      if (cases.length > 0) {
        // Load graph for first case
        await loadGraphForCase(cases[0].caseId);
        setSelectedCase(cases[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGraphForCase = async (caseId: string) => {
    setLoading(true);
    setActiveCaseId(caseId);
    
    try {
      const data = await getGraphData(caseId, 2);
      
      // Validate and clean graph data before setting
      const validatedData = validateGraphData(data);
      
      setGraphData(validatedData);
      console.log(`Graph loaded for ${caseId}: ${validatedData.nodes.length} nodes, ${validatedData.links.length} links`);
    } catch (error) {
      console.error('Error loading graph:', error);
      setGraphData({ nodes: [], links: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const filtered = allCases.filter(c => 
        c.caseId.toLowerCase().includes(query.toLowerCase()) ||
        c.summary.Facts?.toLowerCase().includes(query.toLowerCase()) ||
        c.summary.Issues?.toLowerCase().includes(query.toLowerCase())
      );
      
      if (filtered.length > 0) {
        await loadGraphForCase(filtered[0].caseId);
        setSelectedCase(filtered[0]);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = useCallback(async (node: any) => {
    // Node represents a proposition, get its case
    if (node.data?.proposition?.caseId) {
      const caseData = await getCaseById(node.data.proposition.caseId);
      if (caseData) {
        setSelectedCase(caseData);
      }
    }
  }, []);

  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoom(2, 400);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(0.5, 400);
    }
  };

  const handleCenterView = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  };

  const handleCaseClick = async (caseData: Case) => {
    await loadGraphForCase(caseData.caseId);
    setSelectedCase(caseData);
  };

  return (
    <div className="h-full flex gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <SearchBar onSearch={handleSearch} placeholder="Search cases by ID or content..." />
          {loading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
        </div>

        <Card className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {graphData.nodes.length > 0 ? (
            <>
              <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                nodeLabel="name"
                backgroundColor="transparent"
                nodeColor={(node: any) => node.color || '#0A2647'}
                linkColor={(link: any) => {
                  if (link.type === 'supports') return '#22c55e';
                  if (link.type === 'contradicts') return '#ef4444';
                  return link.color || '#94a3b8';
                }}
                linkDirectionalArrowLength={18}
                linkDirectionalArrowRelPos={1}
                linkWidth={(link: any) => 2.5}
                nodeRelSize={8}
                d3AlphaDecay={0.02}
                d3VelocityDecay={0.3}
                warmupTicks={100}
                cooldownTicks={0}
                d3Force="link"
                d3LinkDistance={500}
                d3ForceCharge={-2000}
                d3CollisionRadius={80}
                onNodeClick={handleNodeClick}
                nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                  const label = node.name;
                  const fontSize = 14 / globalScale;
                  const nodeRadius = node.val || 6;
                  
                  // Draw node shadow
                  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                  ctx.shadowBlur = 10;
                  ctx.shadowOffsetX = 2;
                  ctx.shadowOffsetY = 2;
                  
                  // Draw outer ring
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, nodeRadius + 2, 0, 2 * Math.PI);
                  ctx.fillStyle = '#C9A961';
                  ctx.fill();
                  
                  // Draw main node
                  ctx.shadowBlur = 0;
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
                  ctx.fillStyle = node.color || '#0A2647';
                  ctx.fill();
                  
                  // Draw inner circle for better depth
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, nodeRadius - 2, 0, 2 * Math.PI);
                  ctx.fillStyle = node.color ? node.color : '#144272';
                  ctx.globalAlpha = 0.7;
                  ctx.fill();
                  ctx.globalAlpha = 1;
                  
                  // Draw label background
                  ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  
                  const labelY = node.y + nodeRadius + fontSize + 4;
                  const textWidth = ctx.measureText(label).width;
                  const padding = 6;
                  
                  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                  ctx.strokeStyle = '#C9A961';
                  ctx.lineWidth = 1.5;
                  
                  const rectX = node.x - textWidth / 2 - padding;
                  const rectY = labelY - fontSize / 2 - padding / 2;
                  const rectWidth = textWidth + padding * 2;
                  const rectHeight = fontSize + padding;
                  
                  ctx.beginPath();
                  ctx.roundRect(rectX, rectY, rectWidth, rectHeight, 4);
                  ctx.fill();
                  ctx.stroke();
                  
                  // Draw label text
                  ctx.fillStyle = '#0A2647';
                  ctx.fillText(label, node.x, labelY);
                }}
                linkCanvasObjectMode={() => 'after'}
                linkCanvasObject={(link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                  const start = link.source;
                  const end = link.target;
                  
                  if (typeof start !== 'object' || typeof end !== 'object') return;
                  
                  const textPos = {
                    x: start.x + (end.x - start.x) / 2,
                    y: start.y + (end.y - start.y) / 2
                  };
                  
                  const fontSize = 11;
                  ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  
                  const label = link.label || link.type || '';
                  if (!label) return;
                  
                  const padding = 6;
                  const width = ctx.measureText(label).width + padding * 2;
                  const height = fontSize + padding * 2;
                  
                  // Draw label background
                  let bgColor = '#94a3b8';
                  if (link.type === 'supports') bgColor = '#22c55e';
                  if (link.type === 'contradicts') bgColor = '#ef4444';
                  
                  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
                  ctx.shadowBlur = 4;
                  ctx.shadowOffsetX = 1;
                  ctx.shadowOffsetY = 1;
                  
                  ctx.fillStyle = bgColor;
                  ctx.beginPath();
                  ctx.roundRect(
                    textPos.x - width / 2,
                    textPos.y - height / 2,
                    width,
                    height,
                    4
                  );
                  ctx.fill();
                  
                  // Draw border
                  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                  ctx.lineWidth = 1;
                  ctx.stroke();
                  
                  ctx.shadowBlur = 0;
                  
                  // Draw label text
                  ctx.fillStyle = '#ffffff';
                  ctx.fillText(label, textPos.x, textPos.y);
                }}
              />
              
              <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-2 rounded-xl border-2 border-secondary shadow-xl">
                <Button size="icon" variant="ghost" className="hover:bg-primary hover:text-primary-foreground" onClick={handleZoomIn}>
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="hover:bg-primary hover:text-primary-foreground" onClick={handleZoomOut}>
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="hover:bg-primary hover:text-primary-foreground" onClick={handleCenterView}>
                  <Maximize2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="absolute top-4 left-4">
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-5 py-3 rounded-xl border-2 border-secondary shadow-xl">
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-primary" />
                    <span className="text-sm">
                      Viewing: <span className="font-bold text-primary">{activeCaseId}</span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {graphData.nodes.length} propositions • {graphData.links.length} relationships
                  </p>
                </div>
              </div>

              <div className="absolute bottom-4 left-4">
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-5 py-3 rounded-xl border-2 border-secondary shadow-xl">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Legend</p>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-md"></div>
                      <span className="text-sm">Supports</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-md"></div>
                      <span className="text-sm">Contradicts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-accent shadow-md"></div>
                      <span className="text-sm">Proposition</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
              <Network className="h-12 w-12 opacity-20" />
              <p>Select a case to visualize proposition relationships</p>
            </div>
          )}
        </Card>

        <Card className="p-5 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-secondary/20">
          <h3 className="mb-3 flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Available Cases
          </h3>
          <ScrollArea className="h-32">
            <div className="flex flex-wrap gap-2">
              {allCases.map((c) => (
                <Badge
                  key={c._id}
                  variant={c.caseId === activeCaseId ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    c.caseId === activeCaseId 
                      ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                      : 'hover:bg-secondary hover:text-secondary-foreground hover:scale-105'
                  }`}
                  onClick={() => handleCaseClick(c)}
                >
                  {c.caseId}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {selectedCase && (
        <div className="w-96">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              <CaseDetails caseData={selectedCase} />
              <PropositionList caseId={selectedCase.caseId} />
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
