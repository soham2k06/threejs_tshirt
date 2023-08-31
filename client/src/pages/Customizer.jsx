import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import config from "../config/config";
import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import {
  AiPicker,
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab,
} from "../components";

function Customizer() {
  const { intro } = useSnapshot(state);

  const [file, setFile] = useState("");

  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGenetatingImg] = useState(false);

  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setAtctiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  // Show tab content depending on the activeTab
  function generateTabContent() {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AiPicker
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
            prompt={prompt}
            setPrompt={setPrompt}
          />
        );
      default:
        return null;
    }
  }

  function handleActiveFilterTab(tabName) {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // After setting the state, activeFilterTab is updated

    setAtctiveFilterTab((prev) => {
      return { ...prev, [tabName]: !prev[tabName] };
    });
  }

  async function handleSubmit(type) {
    if (!prompt) return alert("Please enter a prompt");

    try {
      setGenetatingImg(true);

      const res = await fetch("http://localhost:8080/api/v1/dalle", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`);
    } catch (error) {
      alert(error);
    } finally {
      setGenetatingImg(false);
      setActiveEditorTab("");
    }
  }

  function handleDecals(type, res) {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = res;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  }

  function readFile(type) {
    reader(file).then((res) => {
      handleDecals(type, res);
      setActiveEditorTab("");
    });
  }

  return (
    <AnimatePresence>
      {!intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Customizer;
