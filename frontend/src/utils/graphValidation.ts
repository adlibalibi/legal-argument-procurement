import { ForceGraphData } from '../types';

/**
 * Validates and cleans graph data to ensure all links reference existing nodes
 * 
 * @param graphData - The graph data to validate
 * @returns Cleaned graph data with only valid links
 */
export function validateGraphData(graphData: ForceGraphData): ForceGraphData {
  if (!graphData || !graphData.nodes || !graphData.links) {
    console.warn('Invalid graph data structure provided');
    return { nodes: [], links: [] };
  }

  const validNodeIds = new Set(graphData.nodes.map(node => node.id));
  
  const validLinks = graphData.links.filter(link => {
    // Handle both string IDs and object references
    const sourceId = typeof link.source === 'object' && link.source !== null
      ? (link.source as any).id 
      : link.source;
    const targetId = typeof link.target === 'object' && link.target !== null
      ? (link.target as any).id 
      : link.target;
    
    const hasValidSource = validNodeIds.has(sourceId);
    const hasValidTarget = validNodeIds.has(targetId);
    
    if (!hasValidSource || !hasValidTarget) {
      console.warn(
        `Filtering out invalid link: ${sourceId} -> ${targetId}`,
        `(source valid: ${hasValidSource}, target valid: ${hasValidTarget})`
      );
      return false;
    }
    
    return true;
  });

  const filteredCount = graphData.links.length - validLinks.length;
  if (filteredCount > 0) {
    console.log(`Filtered out ${filteredCount} invalid link(s) from graph data`);
  }

  return {
    nodes: graphData.nodes,
    links: validLinks
  };
}

/**
 * Deep clone graph data to prevent mutations
 */
export function cloneGraphData(graphData: ForceGraphData): ForceGraphData {
  return {
    nodes: graphData.nodes.map(node => ({ ...node })),
    links: graphData.links.map(link => ({ ...link }))
  };
}
