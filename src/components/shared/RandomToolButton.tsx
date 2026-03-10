import { useNavigate } from "react-router-dom";
import { useRandomTool } from "../../hooks/useRandomTool";
import Button from "../ui/Button";

export default function RandomToolButton() {
  const navigate = useNavigate();
  const pickRandomTool = useRandomTool();

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => {
        const randomTool = pickRandomTool();
        if (randomTool) navigate(randomTool.path);
      }}
    >
      Random Tool
    </Button>
  );
}
