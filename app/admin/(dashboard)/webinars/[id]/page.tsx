import Link from "next/link";
import { notFound } from "next/navigation";
import { adminStyles } from "@/components/admin/adminStyles";
import { prisma } from "@/lib/prisma";
import { formatWebinarSchedule } from "@/lib/format";

export default async function AdminWebinarRegistrationsPage(props: PageProps<"/admin/webinars/[id]">) {
  const { id } = await props.params;

  const webinar = await prisma.webinar.findUnique({ where: { id } });
  if (!webinar) notFound();

  const registrations = await prisma.webinarRegistration.findMany({
    where: { webinarId: id },
    orderBy: { registeredAt: "desc" },
  });

  const schedule = formatWebinarSchedule(webinar.startsAt);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/webinars" style={{ fontSize: 13, color: "var(--text-muted)" }}>
          &larr; Back to webinars
        </Link>
        <h1 style={{ ...adminStyles.title, marginTop: 8 }}>{webinar.title}</h1>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
          {schedule.combined} &middot; {registrations.length} registration{registrations.length === 1 ? "" : "s"}
        </div>
      </div>

      <div style={adminStyles.tableWrap}>
        <table style={adminStyles.table}>
          <thead>
            <tr>
              <th style={adminStyles.th}>Name</th>
              <th style={adminStyles.th}>Email</th>
              <th style={adminStyles.th}>Phone</th>
              <th style={adminStyles.th}>Registered</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r.id}>
                <td style={adminStyles.td}>{r.fullName}</td>
                <td style={adminStyles.td}>{r.email}</td>
                <td style={adminStyles.td}>{r.phone ?? "—"}</td>
                <td style={adminStyles.td}>{r.registeredAt.toLocaleString("en-US")}</td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr>
                <td style={adminStyles.emptyState} colSpan={4}>
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
