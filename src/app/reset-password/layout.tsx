import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password — Ruven Studio",
  description: "Update your account password for Ruven Studio.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
