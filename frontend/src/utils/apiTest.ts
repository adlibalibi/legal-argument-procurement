// API Connection Test Utility

const API_BASE_URL = 'http://localhost:5000/api';

export async function testBackendConnection() {
  console.log('🧪 Testing Backend Connection...\n');

  const tests = [
    {
      name: 'GET /api/cases',
      url: `${API_BASE_URL}/cases`,
      method: 'GET'
    },
    {
      name: 'GET /api/propositions',
      url: `${API_BASE_URL}/propositions`,
      method: 'GET'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      const response = await fetch(test.url, { method: test.method });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${test.name} - Success`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Data count: ${Array.isArray(data) ? data.length : 'N/A'}`);
        console.log(`   Sample:`, data[0] || data);
      } else {
        console.log(`❌ ${test.name} - Failed`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Error:`, await response.text());
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error`);
      console.log(`   Error:`, error);
    }
    console.log('');
  }

  // Test graph endpoint
  try {
    const casesResponse = await fetch(`${API_BASE_URL}/cases`);
    if (casesResponse.ok) {
      const cases = await casesResponse.json();
      if (cases.length > 0) {
        const firstCaseId = cases[0].caseId;
        console.log(`Testing: GET /api/graph/${firstCaseId}...`);
        
        const graphResponse = await fetch(`${API_BASE_URL}/graph/${firstCaseId}`);
        if (graphResponse.ok) {
          const graphData = await graphResponse.json();
          console.log(`✅ GET /api/graph/:caseId - Success`);
          console.log(`   Nodes: ${graphData.nodes?.length || 0}`);
          console.log(`   Edges: ${graphData.edges?.length || 0}`);
          console.log(`   Sample node:`, graphData.nodes?.[0]);
          console.log(`   Sample edge:`, graphData.edges?.[0]);
        } else {
          console.log(`❌ GET /api/graph/:caseId - Failed`);
          console.log(`   Status: ${graphResponse.status}`);
        }
      }
    }
  } catch (error) {
    console.log(`❌ Graph test error:`, error);
  }

  console.log('\n✨ Test complete! Check results above.');
}

// Auto-run
if (typeof window !== 'undefined') {
  console.log('Run testBackendConnection() to verify API connectivity');
}
