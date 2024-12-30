import { CharacterAllegiancePortrait } from "../EveImages/EveImages";
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
  portaitSize?: number;
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
  portaitSize = 350,
}: PortraitCardProps) {
  return (
    <Card
      className="m-2"
      key={`panel ${character.character_name}`}
      style={style}
      bg={bg}
      border={border}
    >
      <Card.Body className={"d-flex flex-column align-items-center p-0"}>
        <CharacterAllegiancePortrait
          className="card-img-top"
          size={portaitSize}
          {...{ character, roundedImages }}
        />
        <Card.Title className={"text-center w-100 pt-2"}>
          <Row className="justify-content-between">
            <div className="w-auto">{headerIcon && <i className={`${headerIcon} fa-fw`} />}</div>
            <div className="w-auto">{heading}</div>
            <div className="w-auto">
              {isFetching && <i className={`fas fa-sync-alt fa-fw ${styles.menuRefreshSpin}`} />}
            </div>
          </Row>

          {headerIcon && <></>}
        </Card.Title>
        {children}
      </Card.Body>
    </Card>
  );
}
