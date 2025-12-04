"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";

export function SchemeSelector({
  selectedSchemeId,
  onSchemeSelect,
}: {
  selectedSchemeId: Id<"schemes"> | null;
  onSchemeSelect: (schemeId: Id<"schemes">) => void;
}) {
  const schemes = useQuery(api.schemes.list);
  const createScheme = useMutation(api.schemes.create);
  const setComplianceDates = useMutation(api.compliance.setSchemeComplianceDates);

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [strataNumber, setStrataNumber] = useState("");
  const [lastAgmDate, setLastAgmDate] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !strataNumber) return;

    try {
      const schemeId = await createScheme({ name, strataNumber });

      if (lastAgmDate) {
        await setComplianceDates({
          schemeId,
          lastAgmDate: new Date(lastAgmDate).getTime(),
        });
      }

      onSchemeSelect(schemeId);
      setIsCreating(false);
      setName("");
      setStrataNumber("");
      setLastAgmDate("");
    } catch (error) {
      console.error("Failed to create scheme:", error);
    }
  };

  if (!schemes) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="animate-pulse flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Schemes</CardTitle>
        <CardDescription>Select a scheme to view compliance status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {schemes.length > 0 && (
          <div className="space-y-2">
            {schemes.map((scheme) => (
              <button
                key={scheme._id}
                onClick={() => onSchemeSelect(scheme._id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  selectedSchemeId === scheme._id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-secondary/50"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  selectedSchemeId === scheme._id
                    ? "bg-primary/10"
                    : "bg-secondary"
                }`}>
                  <Building2 className={`h-5 w-5 transition-colors ${
                    selectedSchemeId === scheme._id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {scheme.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{scheme.strataNumber}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {!isCreating ? (
          <Button
            variant="outline"
            onClick={() => setIsCreating(true)}
            className="w-full justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add scheme
          </Button>
        ) : (
          <form onSubmit={handleCreate} className="space-y-3 pt-2 border-t border-border">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Scheme name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 123 Example Street"
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="strataNumber"
                className="text-sm font-medium text-foreground"
              >
                Strata number
              </label>
              <input
                id="strataNumber"
                type="text"
                value={strataNumber}
                onChange={(e) => setStrataNumber(e.target.value)}
                placeholder="e.g. SP12345"
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="lastAgmDate"
                className="text-sm font-medium text-foreground"
              >
                Last AGM date
              </label>
              <input
                id="lastAgmDate"
                type="date"
                value={lastAgmDate}
                onChange={(e) => setLastAgmDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground">
                Used to calculate your next AGM due date.
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Create
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
