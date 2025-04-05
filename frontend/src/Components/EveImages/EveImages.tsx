import React from "react";
import { Image } from "react-bootstrap";

type Sizes = 32 | 64 | 128 | 256 | 512;

export interface CharacterPortraitProps extends Partial<Element> {
  character_id?: number | string | undefined;
  size: Sizes;
  height?: number;
  width?: number;
  style?: Partial<React.CSSProperties>;
  className?: string;
}

export const CharacterPortrait = (props: CharacterPortraitProps) => {
  return (
    <Image
      height={props.height && props.height}
      width={props.width && props.width}
      style={props.style && props.style}
      className={props.className && props.className}
      src={`https://images.evetech.net/characters/${props.character_id}/portrait?size=${props.size}`}
    />
  );
};

export interface CorporationLogoProps extends Partial<Element> {
  corporation_id?: number | string | null | undefined;
  size: Sizes;
  height?: number;
  width?: number;
  style?: Partial<React.CSSProperties>;
}

export const CorporationLogo = (props: CorporationLogoProps) => {
  return (
    <Image
      height={props.height && props.height}
      width={props.width && props.width}
      style={props.style && props.style}
      src={`https://images.evetech.net/corporations/${props.corporation_id}/logo?size=${props.size}`}
    />
  );
};

export interface AllianceLogoProps extends Partial<Element> {
  alliance_id?: number | string | undefined;
  size: Sizes;
  height?: number;
  width?: number;
  style?: Partial<React.CSSProperties>;
}

export const AllianceLogo = (props: AllianceLogoProps) => {
  return (
    <Image
      height={props.height && props.height}
      width={props.width && props.width}
      style={props.style && props.style}
      src={`https://images.evetech.net/alliances/${props.alliance_id}/logo?size=${props.size}`}
    />
  );
};

export interface TypeIconProps extends Partial<Element> {
  type_id?: number;
  size: Sizes;
  height?: number;
  width?: number;
  style?: Partial<React.CSSProperties>;
  forceType?: String;
}

export const TypeIcon = (props: TypeIconProps) => {
  return (
    <Image
      height={props.height && props.height}
      width={props.width && props.width}
      style={props.style && props.style}
      src={`https://images.evetech.net/types/${props.type_id}/${
        props.forceType ? props.forceType : props.size > 64 ? "render" : "icon"
      }?size=${props.size}`}
    />
  );
};

export interface PortraitProps extends Partial<Element> {
  character: {
    character_id: number | string | undefined;
    corporation_id?: number | string | null | undefined;
    alliance_id?: number | string | null | undefined;
    faction_id?: number | string | null | undefined;
  };
  size: number;
  rounded_images?: boolean;
  style?: Partial<React.CSSProperties>;
  className?: string;
}

export const CharacterAllegiancePortrait = (props: PortraitProps) => {
  const borderStyle = props.rounded_images
    ? {
        borderRadius: "50%",
      }
    : {};
  return (
    <div
      className={props.className && props.className}
      style={{
        height: `${props.size}px`,
        width: `${props.size}px`,
        position: "relative",
      }}
    >
      <CharacterPortrait
        style={borderStyle}
        height={props.size}
        width={props.size}
        character_id={props.character.character_id}
        size={512}
        className={props.className && props.className}
      />
      <CorporationLogo
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          ...borderStyle,
        }}
        height={props.size / 4}
        width={props.size / 4}
        corporation_id={props.character.corporation_id}
        size={256}
      />
      {props.character.faction_id ? (
        <CorporationLogo
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            ...borderStyle,
          }}
          height={props.size / 4}
          width={props.size / 4}
          corporation_id={props.character.faction_id}
          size={256}
        />
      ) : (
        props.character.alliance_id && (
          <AllianceLogo
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              ...borderStyle,
            }}
            height={props.size / 4}
            width={props.size / 4}
            alliance_id={props.character.alliance_id}
            size={256}
          />
        )
      )}
    </div>
  );
};
