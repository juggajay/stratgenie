"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface LotFormDialogProps {
  schemeId: Id<"schemes">;
  lot?: {
    _id: Id<"lots">;
    lotNumber: string;
    unitEntitlement: number;
    ownerName: string;
    ownerEmail: string;
    ownerAddress?: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LotFormDialog({
  schemeId,
  lot,
  open,
  onOpenChange,
  onSuccess,
}: LotFormDialogProps) {
  const [lotNumber, setLotNumber] = useState("");
  const [unitEntitlement, setUnitEntitlement] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLotLimitError, setIsLotLimitError] = useState(false);

  const createLot = useMutation(api.lots.createLot);
  const updateLot = useMutation(api.lots.updateLot);

  const isEditing = !!lot;

  // Populate form when editing
  useEffect(() => {
    if (lot) {
      setLotNumber(lot.lotNumber);
      setUnitEntitlement(lot.unitEntitlement.toString());
      setOwnerName(lot.ownerName);
      setOwnerEmail(lot.ownerEmail);
      setOwnerAddress(lot.ownerAddress || "");
    } else {
      setLotNumber("");
      setUnitEntitlement("");
      setOwnerName("");
      setOwnerEmail("");
      setOwnerAddress("");
    }
    setError(null);
  }, [lot, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLotLimitError(false);
    setIsSubmitting(true);

    try {
      const entitlement = parseInt(unitEntitlement, 10);
      if (isNaN(entitlement) || entitlement <= 0) {
        throw new Error("Unit entitlement must be a positive number");
      }

      if (isEditing && lot) {
        await updateLot({
          lotId: lot._id,
          lotNumber: lotNumber.trim(),
          unitEntitlement: entitlement,
          ownerName: ownerName.trim(),
          ownerEmail: ownerEmail.trim(),
          ownerAddress: ownerAddress.trim() || undefined,
        });
      } else {
        await createLot({
          schemeId,
          lotNumber: lotNumber.trim(),
          unitEntitlement: entitlement,
          ownerName: ownerName.trim(),
          ownerEmail: ownerEmail.trim(),
          ownerAddress: ownerAddress.trim() || undefined,
        });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error("Lot form error:", err);
      const message = err instanceof Error ? err.message : String(err);
      // Extract the actual error message from Convex errors
      let displayMessage = message.includes("Uncaught Error:")
        ? message.split("Uncaught Error:")[1]?.trim() || message
        : message;

      // Check for lot limit error
      if (displayMessage.includes("LOT_LIMIT_REACHED:")) {
        displayMessage = displayMessage.replace("LOT_LIMIT_REACHED:", "");
        setIsLotLimitError(true);
      }

      setError(displayMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Lot" : "Add New Lot"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the lot details below."
              : "Enter the details for the new lot in the strata roll."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lotNumber" className="text-right">
                Lot Number
              </Label>
              <Input
                id="lotNumber"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                placeholder="e.g., 1, 2A, G01"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unitEntitlement" className="text-right">
                Entitlement
              </Label>
              <Input
                id="unitEntitlement"
                type="number"
                min="1"
                value={unitEntitlement}
                onChange={(e) => setUnitEntitlement(e.target.value)}
                placeholder="e.g., 10"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ownerName" className="text-right">
                Owner Name
              </Label>
              <Input
                id="ownerName"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="John Smith"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ownerEmail" className="text-right">
                Email
              </Label>
              <Input
                id="ownerEmail"
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="john@example.com"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ownerAddress" className="text-right">
                Address
              </Label>
              <Input
                id="ownerAddress"
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
                placeholder="Mailing address (optional)"
                className="col-span-3"
              />
            </div>
          </div>

          {error && (
            <div className={`mb-4 p-3 text-sm rounded-md ${isLotLimitError ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-red-50 text-red-600"}`}>
              <p>{error}</p>
              {isLotLimitError && (
                <Link href="/dashboard/billing" className="inline-flex items-center gap-1 mt-2 text-[#FF6B35] hover:text-[#E85A2A] font-medium">
                  Upgrade your plan
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Add Lot"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
