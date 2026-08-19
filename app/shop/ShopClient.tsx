"use client";

import Image from "next/image";
import { useState } from "react";
import { Alert, Badge, Button, Card, Dialog, Input, RadioGroup, Select, Tabs } from "@/components/ui";
import { books, kenyanCounties, mockPlaces } from "@/lib/data";
import type { Book } from "@/lib/types";

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "ebook", label: "Ebooks" },
  { id: "physical", label: "Physical books" },
];

const MPESA_OPTIONS = [
  { value: "stk", label: "M-PESA STK push (enter your phone, approve on your handset)" },
  { value: "paybill", label: "Paybill number (pay manually, then confirm)" },
];

const EBOOK_METHOD_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
];

export function ShopClient({ initialBuyId }: { initialBuyId?: string }) {
  const [filter, setFilter] = useState("all");

  // Mirrors the original's componentDidMount reading `?buy=` from the URL:
  // derived as lazy initial state (not an effect) so the checkout dialog is
  // already open on first render when a deep link names a book.
  const initialBook = initialBuyId ? books.find((b) => b.id === initialBuyId) ?? null : null;
  const [checkoutOpen, setCheckoutOpen] = useState(initialBook != null);
  const [activeBook, setActiveBook] = useState<Book | null>(initialBook);
  const [mpesaMethod, setMpesaMethod] = useState<"stk" | "paybill">("stk");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [ebookMethod, setEbookMethod] = useState<"email" | "whatsapp">("email");
  const [addressQuery, setAddressQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pinnedAddress, setPinnedAddress] = useState<string | null>(null);
  const [pinnedCoords, setPinnedCoords] = useState<string | undefined>(undefined);

  function openCheckoutFor(book: Book) {
    setActiveBook(book);
    setCheckoutOpen(true);
    setMpesaMethod("stk");
    setPaymentStatus("");
    setProcessing(false);
    setPaymentComplete(false);
    setEbookMethod("email");
    setAddressQuery("");
    setShowSuggestions(false);
    setPinnedAddress(null);
    setPinnedCoords(undefined);
  }

  function closeCheckout() {
    setCheckoutOpen(false);
  }

  const visibleBooks = books.filter((b) => filter === "all" || (filter === "ebook" ? !b.physical : b.physical));

  const isPhysical = !!activeBook?.physical;
  const isStk = mpesaMethod === "stk";
  const isPaybill = mpesaMethod === "paybill";
  const isEmailMethod = ebookMethod === "email";
  const ebookMethodLabel = isEmailMethod ? "email address" : "WhatsApp number";
  const accountNumber = activeBook ? `BOOK-${activeBook.id.toUpperCase()}` : "";
  const payButtonLabel = processing ? "Processing…" : isStk ? "Send STK push" : "I've paid, confirm order";

  const addressSuggestions = mockPlaces.filter((p) => p.label.toLowerCase().includes(addressQuery.toLowerCase()));
  const suggestionsVisible = showSuggestions && addressQuery.length > 0;

  function confirmPayment() {
    setProcessing(true);
    setPaymentStatus(
      isStk ? "STK push sent. Check your phone to enter your M-PESA PIN." : "Confirming your paybill payment with M-PESA…"
    );
    setTimeout(() => {
      setProcessing(false);
      setPaymentComplete(true);
      setPaymentStatus("");
    }, 1400);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "72px 28px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--primary-600)" }}>Shop</div>
        <h1 style={{ margin: "8px 0 0", fontSize: 36, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>
          Ebooks &amp; physical books
        </h1>
        <p style={{ margin: "12px 0 0", fontSize: 16, color: "var(--text-body)", maxWidth: 560 }}>
          Mwenda&rsquo;s writing on naming your reality and reclaiming your power. Ebooks deliver instantly; physical
          books ship across Kenya.
        </p>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 28px 0" }}>
        <Tabs tabs={FILTER_TABS} variant="pill" value={filter} onChange={setFilter} />
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 28px 72px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {visibleBooks.map((book) => (
            <Card key={book.id} padding={0}>
              <div style={{ height: 260, background: "var(--gray-900)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                <Image
                  src={book.cover}
                  alt={book.title}
                  width={935}
                  height={1386}
                  style={{ maxHeight: "100%", maxWidth: "100%", width: "auto", height: "auto", display: "block", boxShadow: "var(--shadow-lg)" }}
                />
              </div>
              <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                <Badge tone={book.tone} variant="soft">
                  {book.format}
                </Badge>
                <h3 style={{ margin: "2px 0 0", fontSize: 16, fontWeight: 600, color: "var(--text-strong)" }}>{book.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{book.blurb}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-strong)" }}>{book.price}</div>
                  <Button variant="primary" size="sm" onClick={() => openCheckoutFor(book)}>
                    Buy now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Dialog
        open={checkoutOpen}
        onClose={closeCheckout}
        title="Checkout"
        width={520}
        footer={
          paymentComplete ? (
            <Button variant="secondary" onClick={closeCheckout}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={closeCheckout}>
                Cancel
              </Button>
              <Button variant="primary" disabled={processing} onClick={confirmPayment}>
                {payButtonLabel}
              </Button>
            </>
          )
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, background: "var(--gray-50)", borderRadius: "var(--radius-md)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)" }}>{activeBook?.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{activeBook?.format}</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-strong)" }}>{activeBook?.price}</div>
          </div>

          {!paymentComplete && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {isPhysical ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>Delivery address (Kenya only)</div>
                  <Input label="Full name" placeholder="Recipient name" />
                  <Select label="County" placeholder="Select county" options={kenyanCounties} />
                  <div style={{ position: "relative" }}>
                    <Input
                      label="Town / estate / street"
                      placeholder="Start typing an address…"
                      value={addressQuery}
                      onChange={(e) => {
                        setAddressQuery(e.target.value);
                        setShowSuggestions(true);
                        setPinnedAddress(null);
                      }}
                      onClick={() => setShowSuggestions(true)}
                      hint="Search powered by Google Places"
                    />
                    {suggestionsVisible && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          zIndex: 20,
                          marginTop: 4,
                          background: "var(--surface-card)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "var(--radius-md)",
                          boxShadow: "var(--shadow-md)",
                          overflow: "hidden",
                        }}
                      >
                        {addressSuggestions.map((s) => (
                          <div
                            key={s.label}
                            onClick={() => {
                              setAddressQuery(s.label);
                              setShowSuggestions(false);
                              setPinnedAddress(s.label);
                              setPinnedCoords(s.coords);
                            }}
                            style={{
                              padding: "10px 14px",
                              fontSize: 13,
                              color: "var(--text-body)",
                              cursor: "pointer",
                              borderBottom: "1px solid var(--border-subtle)",
                            }}
                          >
                            {s.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {pinnedAddress && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--gray-50)", borderRadius: "var(--radius-md)", padding: "10px 14px" }}>
                      <Badge tone="success" variant="soft" dot>
                        Pinned for rider
                      </Badge>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>{pinnedCoords}</span>
                    </div>
                  )}
                  <Input label="Phone number" placeholder="07xx xxx xxx" />
                  <Alert tone="info">
                    Delivery within Kenya takes 3 business days after payment. A flat KES 300 delivery fee applies.
                  </Alert>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>How would you like to receive your ebook?</div>
                  <RadioGroup direction="horizontal" options={EBOOK_METHOD_OPTIONS} value={ebookMethod} onChange={(v) => setEbookMethod(v as "email" | "whatsapp")} />
                  {isEmailMethod ? (
                    <Input label="Email address" type="email" placeholder="you@email.com" />
                  ) : (
                    <Input label="WhatsApp number" placeholder="07xx xxx xxx" prefix="+254" />
                  )}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>Pay with M-PESA</div>
                <RadioGroup options={MPESA_OPTIONS} value={mpesaMethod} onChange={(v) => setMpesaMethod(v as "stk" | "paybill")} />
              </div>

              {isStk && <Input label="M-PESA phone number" placeholder="07xx xxx xxx" prefix="+254" />}

              {isPaybill && (
                <div style={{ background: "var(--gray-50)", borderRadius: "var(--radius-md)", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "var(--text-muted)" }}>Paybill number</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-strong)" }}>400200</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "var(--text-muted)" }}>Account number</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-strong)" }}>{accountNumber}</span>
                  </div>
                  <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                    Complete the payment from your M-PESA menu, then confirm below.
                  </p>
                </div>
              )}

              {paymentStatus && <Alert tone="info">{paymentStatus}</Alert>}
            </div>
          )}

          {paymentComplete && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Alert tone="success">Payment received. Your order is confirmed.</Alert>
              {isPhysical ? (
                <div style={{ background: "var(--gray-50)", borderRadius: "var(--radius-md)", padding: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)", marginBottom: 4 }}>On its way</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--text-body)" }}>
                    {activeBook?.title} will be delivered to the address you provided within 3 business days.
                  </p>
                </div>
              ) : (
                <div style={{ background: "var(--gray-50)", borderRadius: "var(--radius-md)", padding: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)", marginBottom: 4 }}>Your ebook is on its way</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--text-body)" }}>
                    {activeBook?.title} will be sent to the {ebookMethodLabel} you provided within a few minutes.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
