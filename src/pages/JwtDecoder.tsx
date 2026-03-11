import { useMemo, useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import EmptyState from "../components/shared/EmptyState";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import ProgressBar from "../components/ui/ProgressBar";
import Textarea from "../components/ui/Textarea";
import { jwtDecoder } from "../logic/jwtDecoder";

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [hasRun, setHasRun] = useState(false);

  const result = useMemo(() => (hasRun ? jwtDecoder(token) : null), [hasRun, token]);

  const validity = useMemo(() => {
    if (!result || !result.valid) return 0;
    return result.expiration.isExpired ? 0 : 100;
  }, [result]);

  const reset = () => {
    setToken("");
    setHasRun(false);
  };

  const copyValue = useMemo(
    () =>
      [
        `Token:\n${token}`,
        `Error: ${result?.error || "None"}`,
        `Decoded:\n${JSON.stringify(result?.decoded, null, 2)}`,
      ].join("\n\n"),
    [result, token],
  );

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">JWT Decoder</h1>
        <p className="text-sm text-slate-400">Decode JWT header and payload claims in-browser.</p>

        <label className="space-y-2 text-sm">
          <span>JWT Token</span>
          <Textarea value={token} onChange={(event) => setToken(event.target.value)} placeholder="eyJhbGciOi..." className="min-h-24" />
        </label>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setHasRun(true)}>Decode JWT</Button>
          <ResetButton onClick={reset} />
          <CopyButton value={copyValue} />
        </div>
      </Card>

      {result ? (
        <ResultCard>
          <div className="space-y-3">
            {result.error ? <p className="text-sm text-rose-200">Error: {result.error}</p> : null}

            {result.valid && result.decoded ? (
              <>
                <div>
                  <p className="mb-2 text-sm text-slate-300">Expiration Status</p>
                  <ProgressBar value={validity} />
                  <p className="mt-2 text-xs text-slate-300">
                    {result.expiration.secondsUntilExpiration === null
                      ? "No exp claim found."
                      : result.expiration.isExpired
                        ? "Token is expired."
                        : `Expires in ${result.expiration.secondsUntilExpiration} seconds.`}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-sm text-slate-300">Header</p>
                  <pre className="overflow-x-auto rounded-lg bg-slate-900/70 p-3 text-xs text-slate-200">{JSON.stringify(result.decoded.header, null, 2)}</pre>
                </div>

                <div>
                  <p className="mb-2 text-sm text-slate-300">Payload</p>
                  <pre className="overflow-x-auto rounded-lg bg-slate-900/70 p-3 text-xs text-slate-200">{JSON.stringify(result.decoded.payload, null, 2)}</pre>
                </div>

                <label className="space-y-2 text-sm">
                  <span>Signature</span>
                  <Input value={result.decoded.signature} readOnly />
                </label>
              </>
            ) : null}
          </div>
        </ResultCard>
      ) : (
        <EmptyState message="No token decoded yet." />
      )}
    </div>
  );
}
