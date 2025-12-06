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
import { LotFormDialog } from "./lot-form-dialog";
import { Plus, Pencil, Trash2, Users, Building, Loader2 } from "lucide-react";

interface StrataRollListProps {
  schemeId: Id<"schemes">;
}

export function StrataRollList({ schemeId }: StrataRollListProps) {
  const lots = useQuery(api.lots.listLotsForScheme, { schemeId });
  const totalEntitlement = useQuery(api.lots.getTotalUnitEntitlement, { schemeId });
  const deleteLot = useMutation(api.lots.deleteLot);

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<(typeof lots extends (infer T)[] | undefined ? T : never) | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lotToDelete, setLotToDelete] = useState<Id<"lots"> | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleAddLot = () => {
    setEditingLot(null);
    setFormDialogOpen(true);
  };

  const handleEditLot = (lot: NonNullable<typeof editingLot>) => {
    setEditingLot(lot);
    setFormDialogOpen(true);
  };

  const handleDeleteClick = (lotId: Id<"lots">) => {
    setLotToDelete(lotId);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent AlertDialogAction from auto-closing
    if (!lotToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteLot({ lotId: lotToDelete });
      setDeleteDialogOpen(false);
      setLotToDelete(null);
      setDeleteError(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete lot");
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = lots === undefined || totalEntitlement === undefined;

  return (
    <>
      <Card className="card-accent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Strata Roll
              </CardTitle>
              <CardDescription>
                Manage lots, owners, and unit entitlements
              </CardDescription>
            </div>
            <Button onClick={handleAddLot} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Lot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse text-slate-400">Loading strata roll...</div>
            </div>
          ) : lots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">No lots registered</h3>
              <p className="text-sm text-slate-500 mb-4">
                Add lots to the strata roll to start generating levies.
              </p>
              <Button onClick={handleAddLot}>
                <Plus className="h-4 w-4 mr-1" />
                Add First Lot
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Lot #</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right w-[100px]">Entitlement</TableHead>
                      <TableHead className="text-right w-[80px]">Share</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lots.map((lot) => (
                      <TableRow key={lot._id}>
                        <TableCell className="font-medium">{lot.lotNumber}</TableCell>
                        <TableCell>{lot.ownerName}</TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {lot.ownerEmail}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {lot.unitEntitlement}
                        </TableCell>
                        <TableCell className="text-right font-mono text-slate-600">
                          {lot.percentageShare.toFixed(2)}%
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditLot(lot)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(lot._id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="mt-4 flex items-center justify-between px-2 py-3 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600">
                  <span className="font-medium">{totalEntitlement.lotCount}</span> lots registered
                </div>
                <div className="text-sm">
                  <span className="text-slate-600">Total Entitlements: </span>
                  <span className="font-bold text-slate-900">{totalEntitlement.total} UE</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Lot Form Dialog */}
      <LotFormDialog
        schemeId={schemeId}
        lot={editingLot}
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this lot? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {deleteError}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
