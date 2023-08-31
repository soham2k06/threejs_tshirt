import { useSnapshot } from "valtio";
import state from "../store";
import { getContrastingColor } from "../config/helpers";

function CustomButton({ type, title, customStyles, handleClick }) {
  const { color } = useSnapshot(state);

  function generateStyles(type) {
    if (type === "filled") {
      return {
        backgroundColor: color,
        color: getContrastingColor(color),
      };
    } else if (type === "outline") {
      return { borderWidth: "1px", borderColor: color, color };
    }
  }
  return (
    <button
      className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
      style={generateStyles(type)}
      onClick={handleClick}
    >
      {title}
    </button>
  );
}

export default CustomButton;
