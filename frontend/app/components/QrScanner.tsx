"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type QrScannerProps = {
  onScan: (payload: string) => void;
};

export default function QrScanner({ onScan }: QrScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [active, setActive] = useState(false);
  const [scannerError, setScannerError] = useState("");

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => undefined);
      }
    };
  }, []);

  const startScanner = async () => {
    setScannerError("");

    try {
      const scanner = new Html5Qrcode("smartqueue-qr-reader");
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        async (decodedText) => {
          onScan(decodedText);
          await scanner.stop();
          setActive(false);
        },
        () => undefined
      );
      setActive(true);
    } catch (error) {
      setScannerError(error instanceof Error ? error.message : "Unable to start camera scanner");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
    setActive(false);
  };

  return (
    <section className="rounded-md border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Camera Scanner</h2>
          <p className="text-sm text-slate-600">Scan the QR code generated for an appointment.</p>
        </div>
        {active ? (
          <button onClick={stopScanner} className="rounded-md border px-3 py-1.5">
            Stop
          </button>
        ) : (
          <button onClick={startScanner} className="rounded-md bg-emerald-700 px-3 py-1.5 text-white">
            Start Scanner
          </button>
        )}
      </div>
      <div id="smartqueue-qr-reader" className="mt-4 overflow-hidden rounded-md" />
      {scannerError ? <p className="mt-3 text-sm text-red-700">{scannerError}</p> : null}
    </section>
  );
}
