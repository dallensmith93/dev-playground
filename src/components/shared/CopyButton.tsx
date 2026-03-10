import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import Button from "../ui/Button";

export default function CopyButton({ value }: { value: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Button type="button" variant="ghost" onClick={() => copy(value)} disabled={!value.trim()}>
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
