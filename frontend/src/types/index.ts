// Types for the Legal Debate Application

export interface Case {
  _id: string;
  caseId: string;
  summary: {
    Facts: string;
    Issues: string;
    Reasoning: string;
    Decision: string;
  };
}

export interface Proposition {
  _id: string;
  caseId: string;
  section: string;
  proposition: string;
  embedding: number[];
}

export interface Relationship {
  _id: string;
  source: string; // Proposition ObjectId
  target: string; // Proposition ObjectId
  type: 'supports' | 'contradicts';
  similarity: number;
}

// Graph data structures
export interface GraphNode {
  id: string;
  label: string;
  type: string;
  proposition?: Proposition;
  color?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: 'supports' | 'contradicts';
  weight: number;
  color?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// For the graph visualization library
export interface ForceGraphNode {
  id: string;
  name: string;
  val: number;
  color?: string;
  data?: any;
}

export interface ForceGraphLink {
  source: string;
  target: string;
  type: string;
  color?: string;
  label?: string;
}

export interface ForceGraphData {
  nodes: ForceGraphNode[];
  links: ForceGraphLink[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedCases?: string[];
  argumentAnalysis?: ArgumentAnalysis;
  propositions?: PropositionWithRelations[];
}

export interface ArgumentAnalysis {
  mainArgument: string;
  supportingPropositions: PropositionEvidence[];
  contradictingPropositions: PropositionEvidence[];
  strengthScore: number;
  recommendations: string[];
}

export interface PropositionEvidence {
  proposition: Proposition;
  caseId: string;
  similarity: number;
  relationship: 'supports' | 'contradicts';
  context: string;
}

export interface PropositionWithRelations {
  proposition: Proposition;
  supportingCount: number;
  contradictingCount: number;
  relatedCases: string[];
}

export interface DraftArgument {
  id: string;
  title: string;
  content: string;
  supportingEvidence: PropositionEvidence[];
  contradictingEvidence: PropositionEvidence[];
  strengthScore: number;
  createdAt: Date;
}
