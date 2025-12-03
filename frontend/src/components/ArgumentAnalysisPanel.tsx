import { ArgumentAnalysis } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, Scale } from 'lucide-react';
import { Separator } from './ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface ArgumentAnalysisPanelProps {
  analysis: ArgumentAnalysis;
  onCaseClick?: (caseId: string) => void;
}

export function ArgumentAnalysisPanel({ analysis, onCaseClick }: ArgumentAnalysisPanelProps) {
  const getStrengthColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStrengthLabel = (score: number) => {
    if (score >= 70) return 'Strong';
    if (score >= 40) return 'Moderate';
    return 'Weak';
  };

  return (
    <Card className="w-full border-2 border-secondary/20 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-secondary/20">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Scale className="h-5 w-5 text-primary-foreground" />
          </div>
          Argument Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Strength Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Argument Strength</span>
            <span className={`${getStrengthColor(analysis.strengthScore)}`}>
              {getStrengthLabel(analysis.strengthScore)} ({analysis.strengthScore.toFixed(0)}%)
            </span>
          </div>
          <Progress value={analysis.strengthScore} className="h-2" />
        </div>

        <Separator />

        {/* Evidence Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Supporting</span>
            </div>
            <p className="text-2xl">{analysis.supportingPropositions.length}</p>
            <p className="text-xs text-muted-foreground">precedents</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-4 w-4" />
              <span className="text-sm">Contradicting</span>
            </div>
            <p className="text-2xl">{analysis.contradictingPropositions.length}</p>
            <p className="text-xs text-muted-foreground">precedents</p>
          </div>
        </div>

        <Separator />

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Recommendations</span>
            </div>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Separator />

        {/* Detailed Evidence */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="supporting">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Supporting Precedents ({analysis.supportingPropositions.length})
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-3">
                  {analysis.supportingPropositions.map((evidence, idx) => (
                    <div key={idx} className="p-3 rounded-lg border bg-green-50 border-green-200">
                      <div className="flex justify-between items-start mb-2">
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-green-100"
                          onClick={() => onCaseClick?.(evidence.caseId)}
                        >
                          {evidence.caseId}
                        </Badge>
                        <span className="text-xs text-green-700">
                          {(evidence.similarity * 100).toFixed(0)}% match
                        </span>
                      </div>
                      <p className="text-sm mb-1">{evidence.proposition.proposition}</p>
                      <p className="text-xs text-muted-foreground">
                        Section: {evidence.context}
                      </p>
                    </div>
                  ))}
                  {analysis.supportingPropositions.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No supporting precedents found
                    </p>
                  )}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="contradicting">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                Contradicting Precedents ({analysis.contradictingPropositions.length})
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-3">
                  {analysis.contradictingPropositions.map((evidence, idx) => (
                    <div key={idx} className="p-3 rounded-lg border bg-red-50 border-red-200">
                      <div className="flex justify-between items-start mb-2">
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-red-100"
                          onClick={() => onCaseClick?.(evidence.caseId)}
                        >
                          {evidence.caseId}
                        </Badge>
                        <span className="text-xs text-red-700">
                          {(evidence.similarity * 100).toFixed(0)}% match
                        </span>
                      </div>
                      <p className="text-sm mb-1">{evidence.proposition.proposition}</p>
                      <p className="text-xs text-muted-foreground">
                        Section: {evidence.context}
                      </p>
                    </div>
                  ))}
                  {analysis.contradictingPropositions.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No contradicting precedents found
                    </p>
                  )}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
