"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Pencil,
} from "lucide-react";

type ContactType =
  | "building_manager"
  | "secretary"
  | "chairperson"
  | "treasurer"
  | "caretaker"
  | "other";

interface EmergencyContact {
  priority: number;
  contactType: ContactType;
  name: string;
  phone: string;
  email?: string;
}

interface EmergencyContactsFormProps {
  schemeId: Id<"schemes">;
  existingContacts?: Array<{
    priority: number;
    contactType: string;
    name: string;
    phone: string;
    email?: string;
    lastUpdated: number;
  }>;
}

const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  building_manager: "Building Manager",
  secretary: "Secretary",
  chairperson: "Chairperson",
  treasurer: "Treasurer",
  caretaker: "Caretaker",
  other: "Other",
};

export function EmergencyContactsForm({
  schemeId,
  existingContacts = [],
}: EmergencyContactsFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    // Initialize with existing contacts or empty slots
    const initial: EmergencyContact[] = [];
    for (let i = 1; i <= 4; i++) {
      const existing = existingContacts.find((c) => c.priority === i);
      if (existing) {
        initial.push({
          priority: i,
          contactType: existing.contactType as ContactType,
          name: existing.name,
          phone: existing.phone,
          email: existing.email,
        });
      }
    }
    return initial;
  });

  const updateEmergencyContacts = useMutation(
    api.strataHubCompliance.updateEmergencyContacts
  );

  const handleSave = async () => {
    // Validate - at least one contact required
    if (contacts.length === 0) {
      toast.error("Please add at least one emergency contact");
      return;
    }

    // Validate all contacts have required fields
    for (const contact of contacts) {
      if (!contact.name.trim() || !contact.phone.trim()) {
        toast.error("All contacts must have name and phone number");
        return;
      }
    }

    try {
      await updateEmergencyContacts({
        schemeId,
        contacts: contacts.map((c) => ({
          priority: c.priority,
          contactType: c.contactType,
          name: c.name.trim(),
          phone: c.phone.trim(),
          email: c.email?.trim() || undefined,
        })),
      });
      toast.success("Emergency contacts updated");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update contacts");
      console.error(error);
    }
  };

  const addContact = () => {
    if (contacts.length >= 4) {
      toast.error("Maximum 4 emergency contacts allowed");
      return;
    }

    // Find the next available priority
    const usedPriorities = contacts.map((c) => c.priority);
    let nextPriority = 1;
    while (usedPriorities.includes(nextPriority) && nextPriority <= 4) {
      nextPriority++;
    }

    setContacts([
      ...contacts,
      {
        priority: nextPriority,
        contactType: "other",
        name: "",
        phone: "",
        email: "",
      },
    ]);
  };

  const removeContact = (priority: number) => {
    setContacts(contacts.filter((c) => c.priority !== priority));
  };

  const updateContact = (
    priority: number,
    field: keyof EmergencyContact,
    value: string
  ) => {
    setContacts(
      contacts.map((c) => (c.priority === priority ? { ...c, [field]: value } : c))
    );
  };

  // Calculate completion status
  const filledContacts = existingContacts.filter(
    (c) => c.name && c.phone
  ).length;
  const isComplete = filledContacts >= 4;

  return (
    <Card
      className={`bg-white border rounded-xl ${
        isComplete
          ? "border-[#E8E4DE]"
          : "border-amber-200 bg-amber-50/30"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isComplete ? "bg-emerald-50" : "bg-amber-50"
              }`}
            >
              <Users
                className={`h-5 w-5 ${
                  isComplete ? "text-emerald-600" : "text-amber-600"
                }`}
              />
            </div>
            <div>
              <CardTitle className="text-base font-medium">
                Emergency Contacts
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {filledContacts} of 4 contacts set
              </p>
            </div>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="font-display">
                  Emergency Contacts
                </SheetTitle>
                <SheetDescription>
                  NSW Strata Hub requires 4 emergency contacts who can be
                  reached 24/7. These should be people likely to be on-site
                  (building manager, resident committee members).
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {contacts
                  .sort((a, b) => a.priority - b.priority)
                  .map((contact) => (
                    <div
                      key={contact.priority}
                      className="p-4 border border-[#E8E4DE] rounded-lg space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Contact {contact.priority}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContact(contact.priority)}
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label>Contact Type</Label>
                          <Select
                            value={contact.contactType}
                            onValueChange={(value) =>
                              updateContact(
                                contact.priority,
                                "contactType",
                                value
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(CONTACT_TYPE_LABELS).map(
                                ([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label>Name *</Label>
                          <Input
                            placeholder="Full name"
                            value={contact.name}
                            onChange={(e) =>
                              updateContact(
                                contact.priority,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>Phone *</Label>
                          <Input
                            placeholder="e.g., 0412 345 678"
                            value={contact.phone}
                            onChange={(e) =>
                              updateContact(
                                contact.priority,
                                "phone",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>Email (optional)</Label>
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            value={contact.email || ""}
                            onChange={(e) =>
                              updateContact(
                                contact.priority,
                                "email",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                {contacts.length < 4 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={addContact}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                )}

                <div className="pt-4 border-t border-[#E8E4DE]">
                  <Button className="w-full" onClick={handleSave}>
                    Save Contacts
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {existingContacts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No emergency contacts set. Click Edit to add contacts.
          </p>
        ) : (
          <div className="space-y-2">
            {existingContacts
              .sort((a, b) => a.priority - b.priority)
              .map((contact) => (
                <div
                  key={contact.priority}
                  className="flex items-center justify-between py-2 px-3 bg-[#F8F5F0] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground w-4">
                      {contact.priority}.
                    </span>
                    <div>
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {CONTACT_TYPE_LABELS[contact.contactType as ContactType]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
