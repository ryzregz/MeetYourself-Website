import { prisma } from "@/lib/prisma";
import { BooksManager } from "./BooksManager";

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({ orderBy: { createdAt: "desc" } });
  return <BooksManager books={books} />;
}
