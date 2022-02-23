import { PrimitiveAtom, useAtom } from "jotai";
import { layerAtomAtoms, layersAtom, settingsAtom } from "../lib/state";
import { Layer } from "./Layer";
import produce from "immer";
import { GrPowerReset } from "react-icons/gr";
import * as Popover from "@radix-ui/react-popover";

import { AppState } from "../lib/types";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Plus } from "./icons/Plus.svg";
import { generateLayer } from "../lib/generateLayer";

export default function Layers() {
  const [layers, updateLayers] = useAtom(layersAtom);
  const [layerAtoms] = useAtom(layerAtomAtoms);
  return (
    <section className="layers">
      <header className="section-header">
        <h2>Layers</h2>
        <button
          className="add-layer app-btn"
          onClick={() => updateLayers((l) => [generateLayer(layers), ...l])}
        >
          <Plus width={12} />
          <span>Add Layer</span>
        </button>
        <ResetLayers />
      </header>
      {layers.length === 0 ? <AddLayerMessage /> : null}
      <DragDropContext
        onDragEnd={(dragResult) => {
          const { destination, source } = dragResult;
          if (!destination) {
            return;
          }
          updateLayers((l) =>
            produce(l, (draft) => {
              const [removed] = draft.splice(source.index, 1);
              draft.splice(destination.index, 0, removed);
            })
          );
        }}
      >
        <Droppable droppableId="MY-TYPE" type="MY-TYPE">
          {(dropProvider) => (
            <div {...dropProvider.droppableProps} ref={dropProvider.innerRef}>
              {layerAtoms.map((layerAtom, i) => (
                <DraggableLayer
                  key={layers[i].id}
                  id={layers[i].id}
                  layerIndex={i}
                  layerAtom={layerAtom}
                />
              ))}
              {dropProvider.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );
}

function ResetLayers() {
  const [layers, updateLayers] = useAtom(layersAtom);
  const [, updateSettings] = useAtom(settingsAtom);
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="app-btn" disabled={!layers.length}>
          <GrPowerReset size={14} color="currentColor" />
          <span>Reset</span>
        </button>
      </Popover.Trigger>
      <Popover.Content className="popover">
        <Popover.Arrow className="popover-arrow" />
        <div className="popover-inner">
          <span>Are you sure you want to reset all layers?</span>
          <Popover.Close>Cancel</Popover.Close>
          <Popover.Close asChild className="delete-btn">
            <button
              onClick={() => {
                updateLayers((l) => []);
                updateSettings((s) =>
                  produce(s, (draft) => {
                    draft.blend = "normal";
                  })
                );
              }}
            >
              Reset
            </button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}

function DraggableLayer({
  layerAtom,
  layerIndex,
  id,
}: {
  layerAtom: PrimitiveAtom<AppState["layers"][number]>;
  id: string;
  layerIndex: number;
}) {
  return (
    <Draggable draggableId={id} index={layerIndex}>
      {(dragProvided: any, dragSnapshot: any) => (
        <Layer
          ref={dragProvided.innerRef}
          atom={layerAtom}
          id={id}
          layerIndex={layerIndex}
          draggableProps={dragProvided.draggableProps}
          dragHandleProps={dragProvided.dragHandleProps}
        />
      )}
    </Draggable>
  );
}

function AddLayerMessage() {
  return (
    <div className="add-layer-message">
      <span>Add a layer to get started</span>
    </div>
  );
}
