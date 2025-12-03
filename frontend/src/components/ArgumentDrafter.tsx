import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { analyzeArgument } from '../services/api';
import { ArgumentAnalysis } from '../types';
import { ArgumentAnalysisPanel } from './ArgumentAnalysisPanel';
import { Loader2, FileText, Sparkles } from 'lucide-react';
import { Separator } from './ui/separator';

interface ArgumentDrafterProps {
  onCaseClick?: (caseId: string) => void;
}

export function ArgumentDrafter({ onCaseClick }: ArgumentDrafterProps) {
  const [argumentText, setArgumentText] = useState('');
  const [analysis, setAnalysis] = useState<ArgumentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!argumentText.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeArgument(argumentText);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing argument:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exampleArguments = [
    "Employees have a reasonable expectation of privacy in their workplace communications",
    "The employer's monitoring was justified by legitimate business interests",
    "The search violated the Fourth Amendment's protection against unreasonable searches"
  ];

  return (
    <div className="space-y-4">
      <Card className="border-2 border-secondary/20 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-secondary/20">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            Draft & Analyze Your Argument
          </CardTitle>
          <CardDescription>
            Enter your legal argument and we'll analyze it against precedent cases to show supporting and contradicting evidence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Example Arguments */}
          {!argumentText && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {exampleArguments.map((example, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent text-xs py-1.5 px-3"
                    onClick={() => setArgumentText(example)}
                  >
                    {example.slice(0, 50)}...
                  </Badge>
                ))}
              </div>
              <Separator className="my-4" />
            </div>
          )}

          {/* Argument Input */}
          <div className="space-y-2">
            <Textarea
              placeholder="Enter your legal argument here... For example: 'The defendant's right to privacy outweighs the employer's interest in monitoring workplace communications...'"
              value={argumentText}
              onChange={(e) => setArgumentText(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {argumentText.length} characters
              </span>
              <Button
                onClick={handleAnalyze}
                disabled={!argumentText.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Argument
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-secondary/30 p-4 rounded-lg text-sm">
            <p className="text-foreground">
              <strong className="text-primary">How it works:</strong> We analyze your argument against our database of legal precedents, 
              identifying propositions that support or contradict your position based on semantic similarity 
              and relationship scores.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <ArgumentAnalysisPanel analysis={analysis} onCaseClick={onCaseClick} />
      )}
    </div>
  );
}
