"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Badge, Button, Dialog, Input } from "@/components/ui";
import { adminStyles } from "@/components/admin/adminStyles";

interface AdminUserRow {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
}

export function UsersManager({ users, currentUserId }: { users: AdminUserRow[]; currentUserId: string }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  function openCreate() {
    setEmail("");
    setName("");
    setPassword("");
    setError(null);
    setDialogOpen(true);
  }

  async function handleCreate() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to create admin user");
      }
      setDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create admin user");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(user: AdminUserRow) {
    setSavingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (res.ok) router.refresh();
      else {
        const body = await res.json().catch(() => ({}));
        alert(body.error ?? "Failed to update admin user");
      }
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <div style={adminStyles.header}>
        <h1 style={adminStyles.title}>Admin users</h1>
        <Button variant="primary" onClick={openCreate}>
          + New admin
        </Button>
      </div>

      <div style={adminStyles.tableWrap}>
        <table style={adminStyles.table}>
          <thead>
            <tr>
              <th style={adminStyles.th}>Name</th>
              <th style={adminStyles.th}>Email</th>
              <th style={adminStyles.th}>Status</th>
              <th style={adminStyles.th}>Added</th>
              <th style={adminStyles.th} />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={adminStyles.td}>
                  {user.name}
                  {user.id === currentUserId && <span style={{ color: "var(--text-muted)", fontSize: 12 }}> (you)</span>}
                </td>
                <td style={adminStyles.td}>{user.email}</td>
                <td style={adminStyles.td}>
                  <Badge tone={user.isActive ? "success" : "neutral"} variant="soft">
                    {user.isActive ? "Active" : "Deactivated"}
                  </Badge>
                </td>
                <td style={adminStyles.td}>{user.createdAt.toLocaleDateString("en-US")}</td>
                <td style={adminStyles.td}>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={user.id === currentUserId || savingId === user.id}
                    onClick={() => toggleActive(user)}
                  >
                    {user.isActive ? "Deactivate" : "Reactivate"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="New admin"
        width={420}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" disabled={submitting} onClick={handleCreate}>
              {submitting ? "Creating…" : "Create"}
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input
            label="Temporary password"
            type="password"
            hint="At least 8 characters. Share it with them directly — there's no self-service reset yet."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Alert tone="error">{error}</Alert>}
        </div>
      </Dialog>
    </div>
  );
}
