import { useState, useEffect } from "react";
import { Proposition } from "../types";
import { getAllPropositions } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { FileText, Loader2 } from "lucide-react";

interface PropositionListProps {
  caseId: string;
}

export function PropositionList({ caseId }: PropositionListProps) {
  const [propositions, setPropositions] = useState<Proposition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const allProps = await getAllPropositions();

        // Case-insensitive match, because your DB or mock data might have "CASE001" vs "case001"
        const filtered = allProps.filter(
          (p) =>
            p.caseId &&
            p.caseId.trim().toLowerCase() === caseId.trim().toLowerCase()
        );

        console.log("Fetched all propositions:", allProps);
        console.log("Filtered propositions for case", caseId, filtered);
        setPropositions(filtered);
      } catch (error) {
        console.error("Error loading propositions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [caseId]);

  return (
    <Card className="border-2 border-secondary/20 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-secondary/20">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          Propositions ({loading ? "..." : propositions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : propositions.length > 0 ? (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {propositions.map((prop, idx) => (
                <div
                  key={prop._id || idx}
                  className="border-2 border-secondary/20 rounded-lg p-3 space-y-2 bg-white dark:bg-slate-800 hover:border-secondary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/30 text-primary"
                    >
                      {prop.section || `Prop ${idx + 1}`}
                    </Badge>
                  </div>
                  <p className="text-sm">{prop.proposition}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No propositions found for case <b>{caseId}</b>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
