import { useState } from "react";
import Styles from "./BaseTableFilter.module.css";
import { Column, Table as ReactTable } from "@tanstack/react-table";
import { Button, Dropdown, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { useTranslation } from "react-i18next";

// Lets a column supply a nicer label for its own SelectFilter options than
// the raw underlying value (e.g. the wallet table's ref_type column, whose
// raw values are ESI machine keys like "bounty_prizes" - see RefTypeLabel).
// Falls back to SelectFilter's own value.replaceAll("_", " ") when unset, so
// every other column's filter is unaffected.
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- must match the original interface's arity, not just what this augmentation itself uses
  interface ColumnMeta<TData, TValue> {
    filterOptionLabel?: (value: string) => string;
  }
}

const isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

export const NumberFilter = <TData,>({ column }: { column: Column<TData, unknown> }) => {
  const { t } = useTranslation();
  const columnFilterValue = column.getFilterValue();
  const fromToNumber = columnFilterValue as [string, string];

  const popoverNumber = (
    <Popover id="popover-positioned-top" className={Styles.popover}>
      <Popover.Body>
        <input
          type="number"
          value={fromToNumber?.[0] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [e.target.value, old?.[1]])
          }
          placeholder={t("Min")}
          className="form-control"
        />
        <p className="text-center">{t("to")}</p>
        <input
          type="number"
          value={fromToNumber?.[1] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])
          }
          placeholder={t("Max")}
          className="form-control"
        />
        <Button
          variant="secondary"
          size="sm"
          className="w-100 mt-2"
          onClick={() => document.body.click()}
        >
          {t("Close")}
        </Button>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" placement="bottom" rootClose={true} overlay={popoverNumber}>
      <form className={Styles.searchWrapperFrom}>
        <div className={Styles.searchWrapper}>
          <Form.Control
            className={Styles.searchInput}
            readOnly={true}
            type="text"
            placeholder={t("Set Range")}
            value={
              typeof fromToNumber?.[0] != "undefined" || typeof fromToNumber?.[1] != "undefined"
                ? `${
                    typeof fromToNumber?.[0] === "undefined" || fromToNumber?.[0] === ""
                      ? "-∞"
                      : fromToNumber?.[0].toLocaleString()
                  }${` ${t("to")} `}${
                    typeof fromToNumber?.[1] === "undefined" || fromToNumber?.[1] === ""
                      ? "∞"
                      : fromToNumber?.[1].toLocaleString()
                  }`
                : ""
            }
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 512 512"
            className={`${Styles.searchIcon} ${Styles.dropDownIcon}`}
          >
            {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
            <path
              fill="currentColor"
              d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
            />
          </svg>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              column.setFilterValue(() => [undefined, undefined]);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className={Styles.xIcon}
            >
              <path
                fill="currentColor"
                d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z"
              ></path>
            </svg>
          </button>
        </div>
      </form>
    </OverlayTrigger>
  );
};

export const BoolFilter = <TData,>({ column }: { column: Column<TData, unknown> }) => {
  const { t } = useTranslation();
  const passFail = column.getFilterValue();

  const popoverBool = (
    <Popover id="popover-positioned-top" className={Styles.popover}>
      <Popover.Body className={Styles.radioWrapper}>
        <Form.Check
          label={t("True")}
          name="group1"
          type="radio"
          id="radio-true"
          onChange={() => {
            column.setFilterValue(true);
          }}
        />
        <Form.Check
          label={t("False")}
          name="group1"
          type="radio"
          id="radio-false"
          onChange={() => {
            column.setFilterValue(false);
          }}
        />
        <Button
          variant="secondary"
          size="sm"
          className="w-100"
          onClick={() => document.body.click()}
        >
          {t("Close")}
        </Button>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" placement="bottom" rootClose={true} overlay={popoverBool}>
      <form className={Styles.searchWrapperFrom}>
        <div className={Styles.searchWrapper}>
          <Form.Control
            className={Styles.searchInput}
            readOnly={true}
            type="text"
            placeholder={t("Filter")}
            value={typeof passFail === "undefined" ? "" : passFail ? t("True") : t("False")}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 512 512"
            className={`${Styles.searchIcon} ${Styles.dropDownIcon}`}
          >
            {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
            <path
              fill="currentColor"
              d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
            />
          </svg>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              column.setFilterValue(() => undefined);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className={Styles.xIcon}
            >
              <path
                fill="currentColor"
                d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z"
              ></path>
            </svg>
          </button>
        </div>
      </form>
    </OverlayTrigger>
  );
};

export const TextFilter = <TData,>({ column }: { column: Column<TData, unknown> }) => {
  const { t } = useTranslation();
  return (
    <div className={Styles.searchWrapper}>
      <Form.Control
        className={Styles.searchInput}
        type="text"
        placeholder={t("Search")}
        value={(column.getFilterValue() as string) ?? ""}
        onChange={(event) => {
          column.setFilterValue(event.target.value ? event.target.value : "");
        }}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className={Styles.searchIcon}
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <button type="button" onClick={() => column.setFilterValue("")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className={Styles.xIcon}
        >
          <path
            fill="currentColor"
            d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z"
          ></path>
        </svg>
      </button>
    </div>
  );
};

// function setSearchItems(allItems: any) {
//   return allItems;
// }
export const SelectFilter = <TData,>({ column }: { column: Column<TData, unknown> }) => {
  const { t } = useTranslation();
  // The box doubles as both "what's currently applied" and "what you're
  // typing to search/narrow the dropdown" - while idle it should show the
  // applied value's friendly label (see labelFor below), but while the user
  // is actively typing it needs to show their literal keystrokes (which get
  // matched, and applied as the filter itself, against the raw values -
  // see onChange), not a label for whatever they've typed so far.
  const [isEditing, setIsEditing] = useState(false);
  // Drop null/undefined up front - some columns (e.g. a contract's
  // issuer/assignee/acceptor) are legitimately null for some rows, and a
  // stray null here can otherwise trip isObjectorHTML below into treating
  // every value in the column as an object, hiding the filter entirely.
  const sortedUniqueValues = Array.from(column.getFacetedUniqueValues().keys())
    .filter((v) => v !== null && v !== undefined)
    .sort();
  const currentFilterValue = column.getFilterValue() as string;
  const isObjectorHTML =
    isHTML(sortedUniqueValues?.[0]) || typeof sortedUniqueValues?.[0] === "object";

  const labelFor =
    column.columnDef.meta?.filterOptionLabel ?? ((v: string) => v?.replaceAll("_", " ") ?? v);

  const selectOptions = (sortedUniqueValues as string[]).reduce(
    (previousValue: { value: string; label: string }[], currentValue) => {
      // Some columns (e.g. a contract's issuer/assignee/acceptor) are
      // legitimately null for some rows - no reason to offer a "null"
      // filter option for those, and the fallback labelFor would throw on
      // it (`.replaceAll` on null) if it somehow got this far.
      if (currentValue !== undefined && currentValue !== null) {
        if (!isObjectorHTML) {
          if (
            currentFilterValue === undefined ||
            currentValue?.toLowerCase().includes(currentFilterValue?.toLowerCase())
          ) {
            previousValue.push({ value: currentValue, label: labelFor(currentValue) });
          }
        }
      }
      return previousValue;
    },
    [],
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom-start"
      rootClose={true}
      overlay={
        <Dropdown show drop={"down-centered"}>
          <Dropdown.Menu className={Styles.dropDown}>
            <>
              {selectOptions.length > 0 ? (
                selectOptions.map((item) => {
                  if (item?.value) {
                    return (
                      <Dropdown.Item
                        className={Styles.capitaliseWords}
                        eventKey={item.value}
                        onClick={() => {
                          column.setFilterValue(item.value ? item.value : "");
                          document.body.click();
                        }}
                      >
                        {item.label}
                      </Dropdown.Item>
                    );
                  }
                })
              ) : (
                <Dropdown.Item disabled>{t("Start typing to search.")}</Dropdown.Item>
              )}
            </>
          </Dropdown.Menu>
        </Dropdown>
      }
    >
      <form className={Styles.searchWrapperFrom}>
        <div className={Styles.searchWrapper}>
          <Form.Control
            className={Styles.searchInput}
            type="text"
            placeholder={t("Search")}
            value={
              typeof currentFilterValue === "undefined"
                ? ""
                : isEditing
                  ? currentFilterValue
                  : labelFor(currentFilterValue)
            }
            onFocus={(event) => {
              setIsEditing(true);
              // Selects the label text so the very next keystroke replaces
              // it outright, rather than being inserted into the middle of
              // (or appended after) a label that no longer corresponds to
              // what's about to be typed.
              event.target.select();
            }}
            onBlur={() => setIsEditing(false)}
            onChange={(event) => {
              column.setFilterValue(event.target.value ? event.target.value : "");
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className={Styles.searchIcon}
          >
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M15.62 17.03a9 9 0 1 1 1.41-1.41l4.68 4.67a1 1 0 0 1-1.42 1.42l-4.67-4.68ZM17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setIsEditing(false);
              column.setFilterValue(() => undefined);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className={Styles.xIcon}
            >
              <path
                fill="currentColor"
                d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z"
              ></path>
            </svg>
          </button>
        </div>
      </form>
    </OverlayTrigger>
  );
};

export const Filter = <TData,>({
  column,
  table,
}: {
  column: Column<TData, unknown>;
  table: ReactTable<TData>;
}) => {
  const firstValue: unknown = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  if (typeof firstValue === "number") {
    return <NumberFilter {...{ column }} />;
  } else if (typeof firstValue === "boolean") {
    return <BoolFilter {...{ column }} />;
  } else if (typeof firstValue === "object") {
    return <TextFilter {...{ column }} />;
  } else {
    // Used to infer a date column here via Date.parse() on the first row's
    // value and render nothing for it (no date-range filter was ever
    // implemented) - but Date.parse() is permissive enough to accept plenty
    // of ordinary text as a valid date (e.g. EVE item names like "Inherent
    // Implants 'Squire' Power Grid Management EG-602"), which made the
    // filter vanish for arbitrary text columns depending on browser and
    // which row happened to load first (#308). Falling through to
    // SelectFilter for every non-number/boolean/object column, date-like or
    // not, is strictly better than silently disappearing.
    return <SelectFilter {...{ column }} />;
  }
};

export default Filter;
