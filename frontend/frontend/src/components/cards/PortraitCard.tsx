import { CharacterAllegiancePortrait } from "../eveImages/eveImages";
import styles from "./PortraitCard.module.css";
import React from "react";
import { Card } from "react-bootstrap";
import Row from "react-bootstrap/Row";

export declare interface PortraitCardProps {
  children: React.ReactNode; // best, accepts everything React can render
  style?: React.CSSProperties; // to pass through style props
  bg?: string;
  border?: string;
  heading: string;
  isFetching?: boolean;
  headerIcon?: string;
  roundedImages?: string;
  character: any; //todo type from api?
}

export function PortraitCard({
  children,
  character,
  style,
  bg,
  border,
  isFetching,
  headerIcon,
  heading,
  roundedImages,
}: PortraitCardProps) {
  return (
    <Card
      className="m-2"
      key={`panel ${character.character_name}`}
      style={style}
      bg={bg}
      border={border}
    >
      <Card.Body className={"d-flex flex-column align-items-center"}>
        <Card.Title className={"text-center w-100"}>
          <Row className="justify-content-between">
            <div className="w-auto">{headerIcon && <i className={`${headerIcon} fa-fw`} />}</div>
            <div className="w-auto">{heading}</div>
            <div className="w-auto">
              {isFetching && <i className={`fas fa-sync-alt fa-fw ${styles.menuRefreshSpin}`} />}
            </div>
          </Row>

          {headerIcon && <></>}
        </Card.Title>
        <CharacterAllegiancePortrait size={350} {...{ character, roundedImages }} />
        <hr />
        {children}
      </Card.Body>
    </Card>
  );
}
