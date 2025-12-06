"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { LevyGeneratorDialog } from "./levy-generator-dialog";
import { LevyRunDetailsDialog } from "./levy-run-details-dialog";
import { IssueLevyDialog } from "./issue-levy-dialog";
import {
  Plus,
  Trash2,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  Send,
  Loader2,
  Eye,
} from "lucide-react";

interface LevyRunsListProps {
  schemeId: Id<"schemes">;
}

function formatCurrency(cents: bigint | number): string {
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(dollars);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function LevyRunsList({ schemeId }: LevyRunsListProps) {
  const levyRuns = useQuery(api.levies.listLevyRunsForScheme, { schemeId });
  const deleteLevyRun = useMutation(api.levies.deleteLevyRun);

  const [generatorDialogOpen, setGeneratorDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState<Id<"levyRuns"> | null>(null);
  const [runToDelete, setRunToDelete] = useState<Id<"levyRuns"> | null>(null);
  const [runToIssue, setRunToIssue] = useState<Id<"levyRuns"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleViewDetails = (runId: Id<"levyRuns">) => {
    setSelectedRunId(runId);
    setDetailsDialogOpen(true);
  };

  const handleDeleteClick = (runId: Id<"levyRuns">) => {
    setRunToDelete(runId);
    setError(null);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!runToDelete) return;

    setIsDeleting(true);
    try {
      await deleteLevyRun({ levyRunId: runToDelete });
      setDeleteDialogOpen(false);
      setRunToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete levy run");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleIssueClick = (runId: Id<"levyRuns">) => {
    setRunToIssue(runId);
    setError(null);
    setIssueDialogOpen(true);
  };

  const isLoading = levyRuns === undefined;

  const getStatusBadge = (status: string, paidCount: number, invoiceCount: number) => {
    if (status === "draft") {
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Draft
        </Badge>
      );
    }
    if (paidCount === invoiceCount) {
      return (
        <Badge variant="default" className="gap-1 bg-green-600">
          <CheckCircle className="h-3 w-3" />
          Fully Paid
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="gap-1 bg-blue-600">
        <Send className="h-3 w-3" />
        Issued
      </Badge>
    );
  };

  return (
    <>
      <Card className="card-accent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Levy Runs
              </CardTitle>
              <CardDescription>
                Generate and manage levy notices for lot owners
              </CardDescription>
            </div>
            <Button onClick={() => setGeneratorDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New Levy Run
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse text-muted-foreground">Loading levy runs...</div>
            </div>
          ) : levyRuns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No levy runs yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first levy run to generate invoices for lot owners.
              </p>
              <Button onClick={() => setGeneratorDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Generate First Levy Run
              </Button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Fund</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Due Date</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Progress</TableHead>
                      <TableHead className="w-[200px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {levyRuns.map((run) => (
                      <TableRow key={run._id}>
                        <TableCell className="font-medium">
                          {run.periodLabel}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {run.fundType === "admin" ? "Admin" : "Capital Works"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(run.totalAmount)}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          <div className="flex items-center justify-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(run.dueDate)}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(run.status, run.paidCount, run.invoiceCount)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm text-muted-foreground">
                            {run.paidCount}/{run.invoiceCount} paid
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(run._id)}
                              className="h-8"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            {run.status === "draft" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleIssueClick(run._id)}
                                  className="h-8"
                                >
                                  <Send className="h-3 w-3 mr-1" />
                                  Issue
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(run._id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Levy Generator Dialog */}
      <LevyGeneratorDialog
        schemeId={schemeId}
        open={generatorDialogOpen}
        onOpenChange={setGeneratorDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Levy Run</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this draft levy run? This will also delete all
              associated invoices. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Levy Run Details Dialog */}
      <LevyRunDetailsDialog
        levyRunId={selectedRunId}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />

      {/* Issue Levy Dialog */}
      <IssueLevyDialog
        levyRunId={runToIssue}
        open={issueDialogOpen}
        onOpenChange={setIssueDialogOpen}
      />
    </>
  );
}
