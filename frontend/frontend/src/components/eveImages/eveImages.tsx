import React from "react";
import { Image } from "react-bootstrap";

type Sizes = 32 | 64 | 128 | 256 | 512;

export interface CharacterPortraitProps extends Partial<HTMLElement> {
  character_id?: number;
  size: Sizes;
  height?: number;
  width?: number;
  style?: any;
}

export const CharacterPortrait = (props: CharacterPortraitProps) => {
  return (
    <Image
      height={props.height && props.height}
      width={props.width && props.width}
      style={props.style && props.style}
      src={`https://images.evetech.net/characters/${props.character_id}/portrait?size=${props.size}`}
    />
  );
};

export interface CorporationLogoProps extends Partial<HTMLElement> {
  corporation_id?: number;
  size: Sizes;
  height?: number;
  width?: number;
  style?: any;
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

export interface AllianceLogoProps extends Partial<HTMLElement> {
  alliance_id?: number;
  size: Sizes;
  height?: number;
  width?: number;
  style?: any;
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

export interface TypeIconProps extends Partial<HTMLElement> {
  type_id?: number;
  size: Sizes;
  height?: number;
  width?: number;
  style?: any;
}

export const TypeIcon = (props: TypeIconProps) => {
  return (
    <Image
      height={props.height && props.height}
      width={props.width && props.width}
      style={props.style && props.style}
      src={`https://images.evetech.net/types/${props.type_id}/${
        props.size > 64 ? "render" : "icon"
      }?size=${props.size}`}
    />
  );
};

export interface PortraitProps extends Partial<HTMLElement> {
  character: {
    character_id: number;
    corporation_id: number;
    alliance_id?: number;
    faction_id?: number;
  };
  size: number;
  roundedImages?: boolean;
  style?: any;
}

export const CharacterAllegiancePortrait = (props: PortraitProps) => {
  let border = props.roundedImages ? "50%" : "0%";
  return (
    <div
      style={{
        height: `${props.size}px`,
        width: `${props.size}px`,
        position: "relative",
      }}
    >
      <CharacterPortrait
        style={{
          borderRadius: border,
        }}
        height={props.size}
        width={props.size}
        character_id={props.character.character_id}
        size={512}
      />
      <CorporationLogo
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          borderRadius: border,
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
            borderRadius: border,
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
              borderRadius: border,
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
