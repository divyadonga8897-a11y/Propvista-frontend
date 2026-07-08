import AiChatWidget from "@/components/AiChatWidget";

/**
 * Resident Layout — wraps all /resident/* pages.
 * Adds the floating resident-scoped AI chat widget.
 */
export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AiChatWidget role="resident" />
    </>
  );
}
