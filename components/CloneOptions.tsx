/* eslint-disable @next/next/no-html-link-for-pages */
import { useAtom } from "jotai";
import { GrClone, GrEdit } from "react-icons/gr";
import {
  LAYERS_KEY,
  SETTINGS_KEY,
  keyWithPath,
  layersAtom,
  settingsAtom,
} from "../lib/state";
import { AppState } from "../lib/types";

function clone(settings: AppState["settings"], layers: AppState["layers"]) {
  localStorage.setItem(
    keyWithPath(SETTINGS_KEY, "/"),
    JSON.stringify(settings)
  );
  localStorage.setItem(keyWithPath(LAYERS_KEY, "/"), JSON.stringify(layers));
}

export default function CloneOptions() {
  const [settings] = useAtom(settingsAtom);
  const [layers] = useAtom(layersAtom);
  return (
    <section className="share-options">
      <a href="/" className="app-btn-lg">
        <div className="icon">
          <GrEdit size={36} />
        </div>
        <div className="app-btn-lg-right">
          <span className="app-btn-lg-title">Go to the Editor</span>
          <span>Create your own gradient</span>
        </div>
      </a>
      <button
        className="app-btn-lg"
        onClick={() => {
          clone(settings, layers);
          window.location.href = "/";
        }}
      >
        <div className="icon">
          <GrClone size={36} color="currentColor" />
        </div>
        <div className="app-btn-lg-right">
          <span className="app-btn-lg-title">Clone</span>
          <span>Copy this gradient to your editor</span>
          <span className="warn">
            Will overwrite any previously-saved gradient!
          </span>
        </div>
      </button>
    </section>
  );
}
