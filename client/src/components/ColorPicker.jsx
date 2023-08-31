import { SketchPicker } from "react-color";
import { useSnapshot } from "valtio";
import state from "../store";

function ColorPicker() {
  const { color } = useSnapshot(state);
  return (
    <div className="absolute left-full">
      <SketchPicker
        color={color}
        disableAlpha
        onChange={(c) => (state.color = c.hex)}
      />
    </div>
  );
}

export default ColorPicker;
