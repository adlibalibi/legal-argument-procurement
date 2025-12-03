import { Case } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Scale, FileText, Lightbulb, Gavel, CheckCircle2 } from 'lucide-react';

interface CaseDetailsProps {
  caseData: Case;
  onClose?: () => void;
}

export function CaseDetails({ caseData }: CaseDetailsProps) {
  return (
    <Card className="w-full border-2 border-secondary/20 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-secondary/20">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Scale className="h-5 w-5 text-primary-foreground" />
              </div>
              {caseData.caseId}
            </CardTitle>
            <CardDescription className="mt-2">Case Summary</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground shadow-sm">{caseData.caseId}</Badge>
        </div>

        {caseData.summary.Facts && (
          <>
            <Separator />
            <div>
              <h4 className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                Facts
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {caseData.summary.Facts}
              </p>
            </div>
          </>
        )}

        {caseData.summary.Issues && (
          <>
            <Separator />
            <div>
              <h4 className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-secondary" />
                Issues
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {caseData.summary.Issues}
              </p>
            </div>
          </>
        )}

        {caseData.summary.Reasoning && (
          <>
            <Separator />
            <div>
              <h4 className="flex items-center gap-2 mb-2">
                <Gavel className="h-4 w-4 text-accent" />
                Reasoning
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {caseData.summary.Reasoning}
              </p>
            </div>
          </>
        )}

        {caseData.summary.Decision && (
          <>
            <Separator />
            <div>
              <h4 className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Decision
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {caseData.summary.Decision}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
