import Button from "../ui/Button";

export default function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="ghost" onClick={onClick}>
      Reset
    </Button>
  );
}
