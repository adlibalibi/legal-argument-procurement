import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';

export function ConnectionStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error' | 'no-data'>('checking');
  const [message, setMessage] = useState('Connecting to backend...');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const API_BASE_URL = (import.meta.env?.VITE_API_URL as string) || 'http://localhost:5000/api';
      
      // Test cases endpoint with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const casesResponse = await fetch(`${API_BASE_URL}/cases`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!casesResponse.ok) {
        setStatus('error');
        setMessage(`Backend responded with status ${casesResponse.status}`);
        return;
      }

      const cases = await casesResponse.json();
      
      if (cases.length === 0) {
        setStatus('no-data');
        setMessage('Backend connected but no cases found in database');
        setDetails({ cases: 0 });
        return;
      }

      // Test propositions endpoint
      const propsResponse = await fetch(`${API_BASE_URL}/propositions`);
      const props = propsResponse.ok ? await propsResponse.json() : [];

      // Test graph endpoint with first case
      const graphResponse = await fetch(`${API_BASE_URL}/graph/${cases[0].caseId}`);
      const graph = graphResponse.ok ? await graphResponse.json() : null;

      setStatus('connected');
      setMessage('Successfully connected to backend');
      setDetails({
        cases: cases.length,
        propositions: props.length,
        graphNodes: graph?.nodes?.length || 0,
        graphEdges: graph?.edges?.length || 0
      });
    } catch (error: any) {
      // Backend not available - use mock data mode
      setStatus('error');
      setMessage('Backend not available - using demo mode with mock data');
      console.log('Using mock data mode');
      
      // Show mock data details
      setDetails({
        mode: 'demo',
        cases: 5,
        propositions: 16,
        info: 'Start your backend server to connect to real data'
      });
    }
  };

  if (status === 'checking') {
    return (
      <Alert>
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Checking Connection</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  if (status === 'connected') {
    return (
      <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-900 dark:text-green-100">Connected</AlertTitle>
        <AlertDescription className="text-green-800 dark:text-green-200">
          {message}
          {details && (
            <div className="mt-2 text-xs space-y-1">
              <div>📁 Cases: {details.cases}</div>
              <div>📝 Propositions: {details.propositions}</div>
              {details.graphNodes > 0 && (
                <div>🔗 Graph: {details.graphNodes} nodes, {details.graphEdges} edges</div>
              )}
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'no-data') {
    return (
      <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-900 dark:text-yellow-100">No Data</AlertTitle>
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          {message}
          <div className="mt-2 text-xs">
            Add cases and propositions to your MongoDB database to get started.
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-900 dark:text-amber-100">Demo Mode</AlertTitle>
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        {message}
        {details && (
          <div className="mt-2 text-xs space-y-1">
            {details.mode === 'demo' && (
              <>
                <div>✨ Using mock data for demonstration</div>
                <div>📁 {details.cases} sample cases available</div>
                <div>📝 {details.propositions} sample propositions</div>
                <div className="mt-2 pt-2 border-t border-amber-300 dark:border-amber-700">
                  <strong>To connect to your backend:</strong>
                  <div>• Start your Express server on http://localhost:5000</div>
                  <div>• Ensure MongoDB is running with your data</div>
                  <div>• Refresh this page</div>
                </div>
              </>
            )}
            {!details.mode && (
              <>
                <div>• Ensure backend is running on http://localhost:5000</div>
                <div>• Check MongoDB connection</div>
                <div>• Verify CORS is enabled in backend</div>
              </>
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
