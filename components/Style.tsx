import { createPortal } from "react-dom";

export function Style({ css }: { css: string }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <style dangerouslySetInnerHTML={{ __html: css }} />,
    document.head
  );
}
