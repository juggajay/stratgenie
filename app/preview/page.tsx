"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MagicDropzone } from "@/components/ui/magic-dropzone";
import { ActionFeedCard, ActionFeedEmpty } from "@/components/dashboard/action-feed-card";
import {
  Building2,
  Shield,
  Receipt,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Wallet
} from "lucide-react";

export default function PreviewPage() {
  const [showEmpty, setShowEmpty] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold tracking-tight text-primary font-display">
              StrataGenie
            </span>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-lg font-display font-bold tracking-tight text-foreground">
                Sydney Sunday Theme Preview
              </h1>
              <p className="text-sm text-muted-foreground">
                New warm, trustworthy design
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Guardian
            </Button>
            <Button variant="outline">
              <Receipt className="h-4 w-4 mr-2" />
              Finance
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Color Palette Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Sydney Sunday Color Palette</CardTitle>
            <CardDescription>Warm, trustworthy colors evoking financial security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">Ocean Blue</div>
                <p className="text-xs text-muted-foreground text-center">#1E3A5F</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-medium">Sandstone</div>
                <p className="text-xs text-muted-foreground text-center">#B8A990</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-mint flex items-center justify-center text-white text-xs font-medium">Mint</div>
                <p className="text-xs text-muted-foreground text-center">#7BC4A8</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-persimmon flex items-center justify-center text-white text-xs font-medium">Persimmon</div>
                <p className="text-xs text-muted-foreground text-center">#D4704A</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-charcoal flex items-center justify-center text-white text-xs font-medium">Charcoal</div>
                <p className="text-xs text-muted-foreground text-center">#2D3436</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Identity Colors</CardTitle>
            <CardDescription>Each AI agent has a distinct personality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-secretary/30 bg-secretary/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-secretary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-secretary" />
                  </div>
                  <span className="font-display font-bold text-secretary">Secretary</span>
                </div>
                <p className="text-sm text-muted-foreground">Governance & Documents</p>
                <Badge variant="secretary" className="mt-2">Slate Blue</Badge>
              </div>
              <div className="p-4 rounded-lg border border-treasurer/30 bg-treasurer/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-treasurer/10 rounded-lg">
                    <Wallet className="h-5 w-5 text-treasurer" />
                  </div>
                  <span className="font-display font-bold text-treasurer">Treasurer</span>
                </div>
                <p className="text-sm text-muted-foreground">Finance & Invoices</p>
                <Badge variant="treasurer" className="mt-2">Emerald</Badge>
              </div>
              <div className="p-4 rounded-lg border border-guardian/30 bg-guardian/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-guardian/10 rounded-lg">
                    <Shield className="h-5 w-5 text-guardian" />
                  </div>
                  <span className="font-display font-bold text-guardian">Guardian</span>
                </div>
                <p className="text-sm text-muted-foreground">Bylaws & Compliance</p>
                <Badge variant="guardian" className="mt-2">Terracotta</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>Action buttons with consistent styling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </CardContent>
        </Card>

        {/* Badge Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Status Badges</CardTitle>
            <CardDescription>Visual status indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="success">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Success
              </Badge>
              <Badge variant="warning">
                <Clock className="h-3 w-3 mr-1" />
                Warning
              </Badge>
              <Badge variant="danger">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Danger
              </Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="neutral">Neutral</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Magic Dropzone */}
        <Card>
          <CardHeader>
            <CardTitle>Magic Dropzone</CardTitle>
            <CardDescription>Hero interaction with thinking steps</CardDescription>
          </CardHeader>
          <CardContent>
            <MagicDropzone
              onFileDrop={async (file) => {
                console.log("File dropped:", file.name);
                await new Promise(r => setTimeout(r, 5000));
              }}
              idleTitle="Drop your documents here"
              idleDescription="Invoices, minutes, or compliance docs"
            />
          </CardContent>
        </Card>

        {/* Action Feed Cards */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Action Feed Cards</CardTitle>
                <CardDescription>&quot;Inbox Zero&quot; style task cards</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowEmpty(!showEmpty)}>
                {showEmpty ? "Show Cards" : "Show Empty State"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showEmpty ? (
              <ActionFeedEmpty />
            ) : (
              <>
                <ActionFeedCard
                  type="invoice"
                  title="Invoice from Bob's Plumbing"
                  description="$150 needs approval"
                  urgency="normal"
                  agent="treasurer"
                  primaryAction={{ label: "Approve", onClick: () => {} }}
                  secondaryAction={{ label: "View PDF", onClick: () => {} }}
                />
                <ActionFeedCard
                  type="compliance"
                  title="Fire Safety Statement"
                  description="Due in 30 days"
                  urgency="attention"
                  agent="guardian"
                  primaryAction={{ label: "Send RFQ", onClick: () => {} }}
                />
                <ActionFeedCard
                  type="levy"
                  title="Unit 4 late on levies"
                  description="$450 outstanding"
                  urgency="urgent"
                  agent="treasurer"
                  primaryAction={{ label: "Send Reminder", onClick: () => {} }}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Scheme Selector Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Your Schemes</CardTitle>
            <CardDescription>Select a scheme to view compliance status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-primary bg-primary/5 shadow-sm text-left transition-all duration-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">Pinecrest Apartments</p>
                <p className="text-xs text-muted-foreground">SP12345</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 text-left transition-all duration-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">Ocean View Towers</p>
                <p className="text-xs text-muted-foreground">SP67890</p>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Sydney Sunday Theme - Warm, trustworthy design for strata management
          </p>
        </footer>
      </main>
    </div>
  );
}
