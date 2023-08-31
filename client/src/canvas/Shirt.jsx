import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";

import state from "../store";

function Shirt() {
  const snap = useSnapshot(state);
  const { logoDecal, fullDecal, isFullTexture, isLogoTexture, color } = snap;

  const { nodes, materials } = useGLTF("/shirt_baked.glb");

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  useFrame(function ({ state, delta }) {
    easing.dampC(materials.lambert1.color, color, delta);
  });

  const stateString = JSON.stringify(snap);
  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}
        {isLogoTexture && (
          <Decal
            position={[0, 0, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            // map-anisotrophy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
}

export default Shirt;
