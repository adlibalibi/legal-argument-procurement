// Test script to validate mock data integrity

import { mockCases, mockPropositions, mockRelationships, generateMockGraphData } from '../services/mockData';

export function validateMockData() {
  console.log('=== VALIDATING MOCK DATA ===\n');
  
  // Check cases
  console.log(`Cases: ${mockCases.length}`);
  mockCases.forEach(c => {
    console.log(`  - ${c.caseId}`);
  });
  
  // Check propositions by case
  console.log(`\nPropositions: ${mockPropositions.length}`);
  const propsByCaseId = new Map<string, string[]>();
  mockPropositions.forEach(p => {
    if (!propsByCaseId.has(p.caseId)) {
      propsByCaseId.set(p.caseId, []);
    }
    propsByCaseId.get(p.caseId)!.push(p._id);
  });
  
  propsByCaseId.forEach((propIds, caseId) => {
    console.log(`  ${caseId}: ${propIds.join(', ')}`);
  });
  
  // Check relationships
  console.log(`\nRelationships: ${mockRelationships.length}`);
  
  // Validate each relationship
  const allPropIds = new Set(mockPropositions.map(p => p._id));
  const invalidRelationships: any[] = [];
  
  mockRelationships.forEach(rel => {
    if (!allPropIds.has(rel.source)) {
      invalidRelationships.push({ ...rel, issue: `source ${rel.source} not found` });
    }
    if (!allPropIds.has(rel.target)) {
      invalidRelationships.push({ ...rel, issue: `target ${rel.target} not found` });
    }
  });
  
  if (invalidRelationships.length > 0) {
    console.log('\n❌ INVALID RELATIONSHIPS:');
    invalidRelationships.forEach(rel => {
      console.log(`  ${rel._id}: ${rel.source} -> ${rel.target} (${rel.issue})`);
    });
  } else {
    console.log('✅ All relationships are valid');
  }
  
  // Test graph generation for each case
  console.log('\n=== TESTING GRAPH GENERATION ===\n');
  mockCases.forEach(caseData => {
    const graphData = generateMockGraphData(caseData.caseId);
    const nodeIds = new Set(graphData.nodes.map(n => n.id));
    
    const invalidEdges = graphData.edges.filter(e => 
      !nodeIds.has(e.source) || !nodeIds.has(e.target)
    );
    
    console.log(`${caseData.caseId}:`);
    console.log(`  Nodes: ${graphData.nodes.length}`);
    console.log(`  Edges: ${graphData.edges.length}`);
    
    if (invalidEdges.length > 0) {
      console.log(`  ❌ Invalid edges: ${invalidEdges.length}`);
      invalidEdges.forEach(e => {
        console.log(`    ${e.source} -> ${e.target}`);
      });
    } else {
      console.log(`  ✅ All edges valid`);
    }
  });
}

// Run validation
if (typeof window !== 'undefined') {
  (window as any).validateMockData = validateMockData;
  console.log('Mock data validator loaded. Run validateMockData() in console to test.');
}
