const LNBITS_URL = process.env.LNBITS_URL || "https://legend.lnbits.com";
const LNBITS_API_KEY = process.env.LNBITS_API_KEY || "";

interface CreateInvoiceResponse {
  payment_hash: string;
  payment_request: string;
  checking_id: string;
}

interface PaymentStatus {
  paid: boolean;
  preimage: string | null;
}

export async function createInvoice(
  amount: number,
  memo: string,
): Promise<CreateInvoiceResponse> {
  const res = await fetch(`${LNBITS_URL}/api/v1/payments`, {
    method: "POST",
    headers: {
      "X-Api-Key": LNBITS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ out: false, amount, memo }),
  });

  if (!res.ok) {
    throw new Error(`LNbits create invoice failed: ${res.status}`);
  }

  return res.json();
}

export async function payInvoice(
  bolt11: string,
): Promise<{ payment_hash: string }> {
  const res = await fetch(`${LNBITS_URL}/api/v1/payments`, {
    method: "POST",
    headers: {
      "X-Api-Key": LNBITS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ out: true, bolt11 }),
  });

  if (!res.ok) {
    throw new Error(`LNbits pay invoice failed: ${res.status}`);
  }

  return res.json();
}

export async function checkPayment(
  paymentHash: string,
): Promise<PaymentStatus> {
  const res = await fetch(
    `${LNBITS_URL}/api/v1/payments/${paymentHash}`,
    {
      headers: { "X-Api-Key": LNBITS_API_KEY },
    },
  );

  if (!res.ok) {
    throw new Error(`LNbits check payment failed: ${res.status}`);
  }

  return res.json();
}

export async function getWalletBalance(): Promise<number> {
  const res = await fetch(`${LNBITS_URL}/api/v1/wallet`, {
    headers: { "X-Api-Key": LNBITS_API_KEY },
  });

  if (!res.ok) {
    throw new Error(`LNbits wallet balance failed: ${res.status}`);
  }

  const data = await res.json();
  return Math.floor(data.balance / 1000);
}
