
// API Service Layer — Connected to MERN Backend

import {
  Case,
  GraphData,
  ForceGraphData,
  ChatMessage,
  Proposition,
  PropositionEvidence,
  ArgumentAnalysis,
  Relationship,
} from "../types";

import {
  mockCases,
  mockPropositions,
  mockRelationships,
  generateMockGraphData,
} from "./mockData";

const API_BASE_URL = "http://localhost:5000/api"; // Node backend
const EMBEDDING_API_URL = "http://127.0.0.1:5001/embed"; // Python microservice

let backendAvailable: boolean | null = null;

// Check Backend Availability 
async function checkBackendAvailability(): Promise<boolean> {
  if (backendAvailable !== null) return backendAvailable;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/cases`, { signal: controller.signal });
    clearTimeout(timeout);

    backendAvailable = res.ok;
    return backendAvailable;
  } catch {
    console.warn("⚠️ Backend not available, switching to mock mode");
    backendAvailable = false;
    return false;
  }
}

// ============================================
// CASES
// ============================================

export const getAllCases = async (): Promise<Case[]> => {
  const isBackend = await checkBackendAvailability();
  if (!isBackend) return mockCases;

  try {
    const res = await fetch(`${API_BASE_URL}/cases`);
    if (!res.ok) throw new Error("Failed to fetch cases");
    return res.json();
  } catch (err) {
    console.error("Error fetching cases:", err);
    return mockCases;
  }
};

export const getCaseById = async (caseId: string): Promise<Case | null> => {
  const isBackend = await checkBackendAvailability();
  if (!isBackend) return mockCases.find(c => c.caseId === caseId) || null;

  try {
    const res = await fetch(`${API_BASE_URL}/cases/${caseId}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch case");
    return res.json();
  } catch (err) {
    console.error("Error fetching case by ID:", err);
    return mockCases.find(c => c.caseId === caseId) || null;
  }
};

// ============================================
// PROPOSITIONS
// ============================================

export const getAllPropositions = async (): Promise<Proposition[]> => {
  const isBackend = await checkBackendAvailability();
  if (!isBackend) return mockPropositions;

  try {
    const res = await fetch(`${API_BASE_URL}/propositions`);
    if (!res.ok) throw new Error("Failed to fetch propositions");
    return res.json();
  } catch (err) {
    console.error("Error fetching propositions:", err);
    return mockPropositions;
  }
};

export const getPropositionById = async (id: string): Promise<Proposition | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/propositions/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch proposition");
    return res.json();
  } catch (err) {
    console.error("Error fetching proposition:", err);
    return null;
  }
};

// ============================================
// RELATIONSHIPS
// ============================================

export const getRelationships = async (): Promise<Relationship[]> => {
  const isBackend = await checkBackendAvailability();
  if (!isBackend) return mockRelationships;

  try {
    const res = await fetch(`${API_BASE_URL}/relationships`);
    if (!res.ok) throw new Error("Failed to fetch relationships");
    return res.json();
  } catch (err) {
    console.error("Error fetching relationships:", err);
    return mockRelationships;
  }
};

export const getRelationshipsForProposition = async (
  propositionId: string
): Promise<Relationship[]> => {
  try {
    const allRelationships = await getRelationships();
    return allRelationships.filter(
      (rel) => rel.source === propositionId || rel.target === propositionId
    );
  } catch (err) {
    console.error("Error fetching relationships for proposition:", err);
    return [];
  }
};

// ============================================
// GRAPH
// ============================================

export const getGraphData = async (
  caseId: string,
  levels: number = 2
): Promise<ForceGraphData> => {
  const isBackend = await checkBackendAvailability();

  if (!isBackend) {
    // fallback to mock
    const mockGraph = generateMockGraphData(caseId);
    const nodes = mockGraph.nodes.map((node, i) => ({
      id: node.id,
      name: node.label || "Proposition",
      val: 10,
      color: i % 2 === 0 ? "#2563eb" : "#0ea5e9",
      data: node,
    }));

    const links = mockGraph.edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      type: edge.relation,
      label: edge.relation,
      color: edge.relation === "supports" ? "#22c55e" : "#ef4444",
    }));

    return { nodes, links };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/graph/${caseId}?levels=${levels}`);
    if (!res.ok) throw new Error("Failed to fetch graph data");
    const data: GraphData = await res.json();

    // transform for ForceGraph3D
    const nodes = data.nodes.map((n) => ({
      id: n.id,
      name: n.label || "Proposition",
      val: 10,
      color: "#64748b",
      data: n,
    }));

    const validNodeIds = new Set(nodes.map((n) => n.id));
    const links = data.edges
      .filter((e) => validNodeIds.has(e.source) && validNodeIds.has(e.target))
      .map((edge) => ({
        source: edge.source,
        target: edge.target,
        type: edge.relation,
        label: edge.relation,
        color: edge.relation === "supports" ? "#10b981" : "#ef4444",
      }));

    return { nodes, links };
  } catch (err) {
    console.error("Error fetching graph data:", err);
    return generateMockGraphData(caseId);
  }
};

// ✅ Combine multiple cases' graphs into one
export const getCaseGraphData = async (
  caseIds: string[]
): Promise<ForceGraphData> => {
  try {
    const graphs = await Promise.all(caseIds.map((id) => getGraphData(id)));
    const nodeMap = new Map<string, any>();
    const allLinks: any[] = [];

    graphs.forEach((g) => {
      g.nodes.forEach((n) => nodeMap.set(n.id, n));
      allLinks.push(...g.links);
    });

    const validIds = new Set(nodeMap.keys());
    const validLinks = allLinks.filter(
      (l) =>
        validIds.has(l.source as string) && validIds.has(l.target as string)
    );

    return { nodes: Array.from(nodeMap.values()), links: validLinks };
  } catch (err) {
    console.error("Error building merged graph:", err);
    return { nodes: [], links: [] };
  }
};


// ============================================
// EMBEDDING SERVICE (Python Microservice)
// ============================================

export const getQueryEmbedding = async (text: string): Promise<number[]> => {
  try {
    const res = await fetch(EMBEDDING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Failed to fetch embedding");
    const data = await res.json();
    return data.embedding;
  } catch (err) {
    console.error("Error fetching embedding:", err);
    throw err;
  }
};

// ============================================
// ARGUMENT ANALYSIS
// ============================================

export const analyzeArgument = async (
  argumentText: string
): Promise<ArgumentAnalysis> => {
  try {
    const isBackend = await checkBackendAvailability();

    if (!isBackend) {
      console.warn("⚠️ Backend unavailable — using fallback analysis");
      const [propositions, relationships] = await Promise.all([
        getAllPropositions(),
        mockRelationships,
      ]);

      const relevant = propositions
        .filter((p) =>
          argumentText
            .toLowerCase()
            .split(" ")
            .some((w) => w.length > 4 && p.proposition.toLowerCase().includes(w))
        )
        .slice(0, 10);

      const supporting: PropositionEvidence[] = [];
      const contradicting: PropositionEvidence[] = [];

      for (const p of relevant) {
        const rels = relationships.filter(
          (r) => r.source === p._id || r.target === p._id
        );
        const hasSupport = rels.some((r) => r.type === "supports");
        const hasContradict = rels.some((r) => r.type === "contradicts");

        const evidence: PropositionEvidence = {
          proposition: p,
          caseId: p.caseId,
          similarity: Math.random() * 0.3 + 0.7,
          relationship: hasContradict ? "contradicts" : "supports",
          context: p.section,
        };

        if (hasContradict || Math.random() > 0.7)
          contradicting.push(evidence);
        else supporting.push(evidence);
      }

      const strengthScore =
        supporting.length > 0
          ? Math.min(
              100,
              (supporting.length / Math.max(1, contradicting.length)) * 50
            )
          : 30;

      const recommendations: string[] = [];
      if (contradicting.length > supporting.length)
        recommendations.push(
          "Address contradicting precedents and highlight distinctions."
        );
      if (supporting.length > 0)
        recommendations.push("Emphasize supporting precedents.");
      if (supporting.length < 3)
        recommendations.push("Add more supporting precedents.");

      return {
        mainArgument: argumentText,
        supportingPropositions: supporting.slice(0, 5),
        contradictingPropositions: contradicting.slice(0, 5),
        strengthScore,
        recommendations,
      };
    }

    // ✅ Real backend call
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: argumentText }),
    });

    if (!res.ok) throw new Error(`Backend analysis failed`);
    return res.json();
  } catch (err) {
    console.error("Error analyzing argument:", err);
    throw err;
  }
};

// ============================================
// CHAT
// ============================================

export const sendChatMessage = async (
  message: string,
  history: ChatMessage[]
): Promise<ChatMessage> => {
  const isAnalysis =
    message.toLowerCase().includes("analyze") ||
    message.toLowerCase().includes("argument");

  if (isAnalysis) {
    const analysis = await analyzeArgument(message);
    let content = `I've analyzed your argument:\n\n`;
    content += `**Strength Score:** ${analysis.strengthScore.toFixed(0)}/100\n`;
    content += `**Supporting:** ${analysis.supportingPropositions.length} | **Contradicting:** ${analysis.contradictingPropositions.length}\n\n`;

    if (analysis.recommendations?.length)
      analysis.recommendations.forEach(
        (r, i) => (content += `${i + 1}. ${r}\n`)
      );

    const relatedCases = [
      ...analysis.supportingPropositions.map((p) => p.caseId),
      ...analysis.contradictingPropositions.map((p) => p.caseId),
    ];

    return {
      id: Date.now().toString(),
      role: "assistant",
      content,
      timestamp: new Date(),
      relatedCases,
      argumentAnalysis: analysis,
    };
  }

  // Fallback generic response
  const propositions = await getAllPropositions();
  const relevant = propositions
    .filter((p) =>
      message
        .toLowerCase()
        .split(" ")
        .some((w) => w.length > 4 && p.proposition.toLowerCase().includes(w))
    )
    .slice(0, 3);

  let content = `Here are some relevant propositions:\n\n`;
  if (relevant.length > 0) {
    relevant.forEach(
      (p, i) =>
        (content += `${i + 1}. **${p.section}** (Case ${p.caseId}): "${p.proposition}"\n\n`)
    );
    content += `Would you like me to analyze how they support or contradict your argument?`;
  } else {
    content += `No direct matches found. Try saying “analyze my argument” for deeper feedback.`;
  }

  return {
    id: Date.now().toString(),
    role: "assistant",
    content,
    timestamp: new Date(),
    relatedCases: relevant.map((p) => p.caseId),
  };
};
