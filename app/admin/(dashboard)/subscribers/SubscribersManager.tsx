"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NewsletterSubscriber } from "@prisma/client";
import { Badge, Button } from "@/components/ui";
import { adminStyles } from "@/components/admin/adminStyles";

export function SubscribersManager({ subscribers }: { subscribers: NewsletterSubscriber[] }) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);

  async function toggleStatus(sub: NewsletterSubscriber) {
    setSavingId(sub.id);
    try {
      const nextStatus = sub.status === "subscribed" ? "unsubscribed" : "subscribed";
      const res = await fetch(`/api/admin/subscribers/${sub.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) router.refresh();
    } finally {
      setSavingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    const res = await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div>
      <div style={adminStyles.header}>
        <h1 style={adminStyles.title}>Newsletter subscribers</h1>
      </div>

      <div style={adminStyles.tableWrap}>
        <table style={adminStyles.table}>
          <thead>
            <tr>
              <th style={adminStyles.th}>Email</th>
              <th style={adminStyles.th}>Status</th>
              <th style={adminStyles.th}>Subscribed</th>
              <th style={adminStyles.th} />
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub) => (
              <tr key={sub.id}>
                <td style={adminStyles.td}>{sub.email}</td>
                <td style={adminStyles.td}>
                  <Badge tone={sub.status === "subscribed" ? "success" : "neutral"} variant="soft">
                    {sub.status}
                  </Badge>
                </td>
                <td style={adminStyles.td}>{sub.subscribedAt.toLocaleDateString("en-US")}</td>
                <td style={adminStyles.td}>
                  <div style={adminStyles.actionsRow}>
                    <Button variant="outline" size="sm" disabled={savingId === sub.id} onClick={() => toggleStatus(sub)}>
                      {sub.status === "subscribed" ? "Unsubscribe" : "Resubscribe"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(sub.id)}>
                      Remove
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td style={adminStyles.emptyState} colSpan={4}>
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
