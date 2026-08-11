"use client";

import { useCallback, useRef, useState } from "react";
import { HowManyBridge } from "./HowManyBridge";

export function HowManyHost() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [shellDocument, setShellDocument] = useState<Document | null>(null);

  const connectShell = useCallback(() => {
    setShellDocument(frameRef.current?.contentDocument ?? null);
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#08060d]">
      <iframe
        ref={frameRef}
        src="/howmany-shell"
        title="HowMany product shell"
        className="block h-full w-full border-0 bg-[#08060d]"
        onLoad={connectShell}
      />
      {shellDocument ? <HowManyBridge shellDocument={shellDocument} /> : null}
    </main>
  );
}
