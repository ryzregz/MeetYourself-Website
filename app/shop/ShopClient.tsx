"use client";

import Image from "next/image";
import { useState } from "react";
import type { Book } from "@prisma/client";
import { Alert, Badge, Button, Card, Dialog, Input, RadioGroup, Select, Tabs } from "@/components/ui";
import { Reveal } from "@/components/site/Reveal";
import { kenyanCounties, mockPlaces } from "@/lib/data";
import { formatKes } from "@/lib/format";

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

export function ShopClient({ books, initialBuyId }: { books: Book[]; initialBuyId?: string }) {
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

  const [recipientName, setRecipientName] = useState("");
  const [county, setCounty] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");

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
    setRecipientName("");
    setCounty("");
    setDeliveryPhone("");
    setEmail("");
    setWhatsappNumber("");
    setMpesaPhone("");
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
  const accountNumber = activeBook ? `BOOK-${activeBook.id.slice(0, 8).toUpperCase()}` : "";
  const payButtonLabel = processing ? "Processing…" : isStk ? "Send STK push" : "I've paid, confirm order";

  const addressSuggestions = mockPlaces.filter((p) => p.label.toLowerCase().includes(addressQuery.toLowerCase()));
  const suggestionsVisible = showSuggestions && addressQuery.length > 0;

  const canSubmit =
    (isPhysical
      ? !!recipientName.trim() && !!county && !!(pinnedAddress || addressQuery.trim()) && !!deliveryPhone.trim()
      : isEmailMethod
        ? !!email.trim()
        : !!whatsappNumber.trim()) &&
    (!isStk || !!mpesaPhone.trim());

  async function confirmPayment() {
    if (!activeBook) return;
    setProcessing(true);
    setPaymentStatus(
      isStk ? "STK push sent. Check your phone to enter your M-PESA PIN." : "Confirming your paybill payment with M-PESA…"
    );
    try {
      // Keep the simulated STK-push pause — there's no real payment gateway wired up yet.
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const buyerPhone = isStk ? mpesaPhone : isPhysical ? deliveryPhone : whatsappNumber;
      const res = await fetch("/api/shop/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: activeBook.id,
          paymentMethod: isStk ? "mpesa_stk" : "mpesa_paybill",
          buyerPhone: buyerPhone || undefined,
          buyerEmail: !isPhysical && isEmailMethod ? email : undefined,
          deliveryMethod: isPhysical ? undefined : ebookMethod,
          delivery: isPhysical
            ? {
                recipientName,
                county,
                addressLine: pinnedAddress ?? addressQuery,
                coordinates: pinnedCoords,
                phone: deliveryPhone,
              }
            : undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong recording your order.");
      }
      setPaymentComplete(true);
      setPaymentStatus("");
    } catch (err) {
      setPaymentStatus(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 28px 0" }}>
        <Reveal>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--primary-600)" }}>Shop</div>
          <h1 style={{ margin: "8px 0 0", fontSize: 36, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>
            Ebooks &amp; physical books
          </h1>
          <p style={{ margin: "12px 0 0", fontSize: 16, color: "var(--text-body)", maxWidth: 560 }}>
            Mwenda&rsquo;s writing on naming your reality and reclaiming your power. Ebooks deliver instantly; physical
            books ship across Kenya.
          </p>
        </Reveal>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 28px 0" }}>
        <Tabs tabs={FILTER_TABS} variant="pill" value={filter} onChange={setFilter} />
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 28px 56px" }}>
        {visibleBooks.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No titles in this category yet — check back soon.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {visibleBooks.map((book, i) => (
              <Reveal key={book.id} delayMs={(i % 3) * 90}>
                <Card interactive padding={0}>
                  <div className="hover-zoom-frame" style={{ height: 260, background: "var(--gray-900)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      width={935}
                      height={1386}
                      style={{ maxHeight: "100%", maxWidth: "100%", width: "auto", height: "auto", display: "block", boxShadow: "var(--shadow-lg)" }}
                    />
                  </div>
                  <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                    <Badge tone={book.tone === "neutral" ? "neutral" : "brand"} variant="soft">
                      {book.format}
                    </Badge>
                    <h3 style={{ margin: "2px 0 0", fontSize: 16, fontWeight: 600, color: "var(--text-strong)" }}>{book.title}</h3>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{book.blurb}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-strong)" }}>{formatKes(book.priceKes)}</div>
                      <Button variant="primary" size="sm" onClick={() => openCheckoutFor(book)}>
                        Buy now
                      </Button>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
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
              <Button variant="primary" disabled={processing || !canSubmit} onClick={confirmPayment}>
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
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-strong)" }}>{activeBook ? formatKes(activeBook.priceKes) : ""}</div>
          </div>

          {!paymentComplete && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {isPhysical ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>Delivery address (Kenya only)</div>
                  <Input label="Full name" placeholder="Recipient name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
                  <Select label="County" placeholder="Select county" options={kenyanCounties} value={county} onChange={(e) => setCounty(e.target.value)} />
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
                  <Input label="Phone number" placeholder="07xx xxx xxx" value={deliveryPhone} onChange={(e) => setDeliveryPhone(e.target.value)} />
                  <Alert tone="info">
                    Delivery within Kenya takes 3 business days after payment. A flat KES 300 delivery fee applies.
                  </Alert>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>How would you like to receive your ebook?</div>
                  <RadioGroup direction="horizontal" options={EBOOK_METHOD_OPTIONS} value={ebookMethod} onChange={(v) => setEbookMethod(v as "email" | "whatsapp")} />
                  {isEmailMethod ? (
                    <Input label="Email address" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  ) : (
                    <Input label="WhatsApp number" placeholder="07xx xxx xxx" prefix="+254" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} />
                  )}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>Pay with M-PESA</div>
                <RadioGroup options={MPESA_OPTIONS} value={mpesaMethod} onChange={(v) => setMpesaMethod(v as "stk" | "paybill")} />
              </div>

              {isStk && <Input label="M-PESA phone number" placeholder="07xx xxx xxx" prefix="+254" value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} />}

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
