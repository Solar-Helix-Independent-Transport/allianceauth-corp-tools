import { CharacterAllegiancePortrait } from "../eveImages";
import styles from "./PortraitPanel.module.css";
import React from "react";
import { Glyphicon, Panel } from "react-bootstrap";

export declare interface PortraitPanelProps {
  children: React.ReactNode; // best, accepts everything React can render
  style?: React.CSSProperties; // to pass through style props
  heading: string;
  isFetching?: boolean;
  headerIcon?: string;
  roundedImages?: boolean;
  character: any; //todo type from api?
}

export function PortraitPanel({
  children,
  character,
  style,
  isFetching,
  headerIcon,
  heading,
  roundedImages,
}: PortraitPanelProps) {
  return (
    <Panel key={`panel ${character.character_name}`} style={style} className={"flex-child"}>
      <Panel.Heading>
        <h4 className={"text-center"}>
          {headerIcon && <Glyphicon className="pull-left" glyph={headerIcon} />}
          {heading}
          {isFetching && (
            <Glyphicon className={`${styles.menuRefreshSpin} pull-right`} glyph="refresh" />
          )}
        </h4>
      </Panel.Heading>
      <Panel.Body className="flex-container flex-body">
        <CharacterAllegiancePortrait size={350} {...{ character, roundedImages }} />
        {children}
      </Panel.Body>
    </Panel>
  );
}
