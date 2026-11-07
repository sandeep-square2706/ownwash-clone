export type RazorpayOrderResponse = {
  key_id: string;
  order_id: string;
  amount: number;
  currency: string;
  booking_id: number;
  booking_reference: string;
};

export type RazorpayVerifyResponse = {
  success?: boolean;
  message?: string;
  detail?: string;
  payment_status?: string;
  booking_id?: number;
  booking_reference?: string;
  booking_status?: string;
};

type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutInstrument = {
  method: "upi";
  flows: ["intent", "qr"];
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    booking_reference: string;
  };
  theme: {
    color: string;
  };
  config: {
    display: {
      blocks: {
        upi_qr: {
          name: string;
          instruments: RazorpayCheckoutInstrument[];
        };
      };
      sequence: ["block.upi_qr"];
      preferences: {
        show_default_blocks: true;
      };
    };
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler: (response: RazorpayPaymentResponse) => void;
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (
  options: RazorpayOptions,
) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

type PaymentRequest = <T>(
  path: string,
  options?: { method?: string; body?: unknown },
) => Promise<T>;

export async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.Razorpay) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), {
        once: true,
      });
      existingScript.addEventListener("error", () => resolve(false), {
        once: true,
      });

      if (window.Razorpay) {
        resolve(true);
      }

      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout({
  bookingId,
  customer,
  request,
}: {
  bookingId: number;
  customer: { name: string; email: string; contact: string };
  request: PaymentRequest;
}): Promise<RazorpayVerifyResponse> {
  const razorpayLoaded = await loadRazorpayScript();

  if (!razorpayLoaded) {
    throw new Error(
      "Unable to load Razorpay Checkout. Please check your internet connection and try again.",
    );
  }

  const Razorpay = window.Razorpay;
  if (!Razorpay) {
    throw new Error(
      "Razorpay Checkout is unavailable. Please refresh the page and try again.",
    );
  }

  const order = await request<RazorpayOrderResponse>(
    "/payments/create-order/",
    {
      method: "POST",
      body: { booking_id: bookingId },
    },
  );

  return new Promise<RazorpayVerifyResponse>((resolve, reject) => {
    let settled = false;

    const finishResolve = (verification: RazorpayVerifyResponse) => {
      if (settled) return;
      settled = true;
      resolve(verification);
    };

    const finishReject = (error: Error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    const checkout = new Razorpay({
      key: order.key_id,
      amount: order.amount,
      currency: order.currency,
      name: "Zaapino",
      description: `Cleaning service booking ${order.booking_reference}`,
      order_id: order.order_id,
      prefill: customer,
      notes: { booking_reference: order.booking_reference },
      theme: { color: "#1769e8" },
      config: {
        display: {
          blocks: {
            upi_qr: {
              name: "UPI apps and QR",
              instruments: [{ method: "upi", flows: ["intent", "qr"] }],
            },
          },
          sequence: ["block.upi_qr"],
          preferences: { show_default_blocks: true },
        },
      },
      modal: {
        ondismiss: () =>
          finishReject(
            new Error(
              "Payment was cancelled. Your booking is still awaiting payment.",
            ),
          ),
      },
      handler: async (response) => {
        try {
          const verification = await request<RazorpayVerifyResponse>(
            "/payments/verify/",
            {
              method: "POST",
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            },
          );

          if (
            verification.payment_status !== "CAPTURED" ||
            verification.success !== true
          ) {
            throw new Error(
              verification.detail ??
                verification.message ??
                "Payment could not be confirmed.",
            );
          }

          finishResolve(verification);
        } catch (error) {
          finishReject(
            error instanceof Error
              ? error
              : new Error("Payment verification failed."),
          );
        }
      },
    });

    checkout.open();
  });
}
