import Styles from "./BaseTableFilter.module.css";
import { Column, Table as ReactTable, Row } from "@tanstack/react-table";
import { Button, Dropdown, Form, OverlayTrigger, Popover } from "react-bootstrap";

const isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

const isDate = (str: string) => {
  const dateCheck = Date.parse(str);
  return !isNaN(dateCheck);
};
export const NameObjectArrayFilterFn = (row: Row<any>, columnId: string, filterValue: any) => {
  const data: any = row.getValue(columnId);
  const _svrs = data.reduce((o: string, r: any) => (o += `|${r.name}`), "");
  return _svrs.toLowerCase().includes(filterValue.toLowerCase());
};

export const NumberFilter = ({ column }: { column: Column<any, any> }) => {
  const columnFilterValue = column.getFilterValue();
  const fromToNumber = columnFilterValue as [string, string];

  const popoverNumber = (
    <Popover id="popover-positioned-top">
      <div className="p-3">
        <input
          type="number"
          value={fromToNumber?.[0] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [e.target.value, old?.[1]])
          }
          placeholder={`Min`}
          className="form-control"
        />
        <p className="text-center">to</p>
        <input
          type="number"
          value={fromToNumber?.[1] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])
          }
          placeholder={`Max`}
          className="form-control"
        />
        <Button
          variant="secondary"
          size="sm"
          className="w-100 mt-2"
          onClick={() => document.body.click()}
        >
          Close
        </Button>
      </div>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" placement="bottom" rootClose={true} overlay={popoverNumber}>
      <form
        className={Styles.searchWrapperFrom}
        onReset={() => {
          column.setFilterValue(() => [undefined, undefined]);
        }}
      >
        <div className={Styles.searchWrapper}>
          <Form.Control
            className={Styles.searchInput}
            readOnly={true}
            type="text"
            placeholder="Set Range"
            value={
              typeof fromToNumber?.[0] != "undefined" || typeof fromToNumber?.[1] != "undefined"
                ? `${
                    typeof fromToNumber?.[0] === "undefined" || fromToNumber?.[0] === ""
                      ? "-∞"
                      : fromToNumber?.[0].toLocaleString()
                  }${" to "}${
                    typeof fromToNumber?.[1] === "undefined" || fromToNumber?.[1] === ""
                      ? "∞"
                      : fromToNumber?.[1].toLocaleString()
                  }`
                : undefined
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
          <button type="reset">
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

export const BoolFilter = ({ column }: { column: Column<any, any> }) => {
  const passFail = column.getFilterValue();

  const popoverBool = (
    <Popover id="popover-positioned-top">
      <div className={`${Styles.radioWrapper} p-2`}>
        <Form.Check
          label="True"
          name="group1"
          type="radio"
          id="radio-true"
          onChange={() => {
            column.setFilterValue(true);
          }}
        />
        <Form.Check
          label="False"
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
          Close
        </Button>
      </div>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" placement="bottom" rootClose={true} overlay={popoverBool}>
      <form
        className={Styles.searchWrapperFrom}
        onReset={() => {
          column.setFilterValue(() => undefined);
        }}
      >
        <div className={Styles.searchWrapper}>
          <Form.Control
            className={Styles.searchInput}
            readOnly={true}
            type="text"
            placeholder="Filter"
            value={typeof passFail === "undefined" ? undefined : passFail ? "True" : "False"}
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
          <button type="reset">
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

export const TextFilter = ({ column }: { column: Column<any, any> }) => {
  return (
    <form
      onReset={() => {
        column.setFilterValue(null);
      }}
    >
      <div className={Styles.searchWrapper}>
        <Form.Control
          className={Styles.searchInput}
          type="text"
          placeholder="Search"
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
        <button type="reset">
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
  );
};

// function setSearchItems(allItems: any) {
//   return allItems;
// }
export const SelectFilter = ({ column }: { column: Column<any, any> }) => {
  const sortedUniqueValues = Array.from(column.getFacetedUniqueValues().keys()).sort();
  const currentFilterValue = column.getFilterValue() as string;
  const isObjectorHTML =
    isHTML(sortedUniqueValues?.[0]) || typeof sortedUniqueValues?.[0] === "object";

  const selectOptions = sortedUniqueValues.reduce(
    (previousValue: Array<any>, currentValue: any) => {
      if (typeof currentValue != "undefined") {
        if (!isObjectorHTML) {
          if (
            currentFilterValue === undefined ||
            currentValue?.toLowerCase().includes(currentFilterValue?.toLowerCase())
          ) {
            previousValue.push({ value: currentValue, label: currentValue });
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
                selectOptions.map((item: any) => {
                  if (item?.value) {
                    // const gaps = item?.value.split(" ").length;
                    // const cammelCase =
                    //   gaps === 0 ? item?.value?.match(/[A-Z][a-z]+/g)?.join(" ") : false;
                    return (
                      <Dropdown.Item
                        className={Styles.capitaliseWords}
                        eventKey={item.value}
                        onClick={() => {
                          column.setFilterValue(item.value ? item.value : "");
                          document.body.click();
                        }}
                      >
                        {/* {cammelCase ? cammelCase : item.value.replaceAll("_", " ")} */}
                        {item.value.replaceAll("_", " ")}
                      </Dropdown.Item>
                    );
                  }
                })
              ) : (
                <Dropdown.Item disabled>Start typing to search.</Dropdown.Item>
              )}
            </>
          </Dropdown.Menu>
        </Dropdown>
      }
    >
      <form
        className={Styles.searchWrapperFrom}
        onReset={() => {
          column.setFilterValue(() => undefined);
        }}
      >
        <div className={Styles.searchWrapper}>
          <Form.Control
            className={Styles.searchInput}
            type="text"
            placeholder="Search"
            value={typeof currentFilterValue === "undefined" ? undefined : currentFilterValue}
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
          <button type="reset">
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

export const Filter = ({ column, table }: { column: Column<any, any>; table: ReactTable<any> }) => {
  const firstValue: any = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  if (typeof firstValue === "number") {
    return <NumberFilter {...{ column }} />;
  } else if (typeof firstValue === "boolean") {
    return <BoolFilter {...{ column }} />;
  } else if (typeof firstValue === "object") {
    return <TextFilter {...{ column }} />;
  } else {
    if (isDate(firstValue)) {
      // TODO maybe add a date range selecterer for now nothing.
      return <></>;
    } else {
      return <SelectFilter {...{ column }} />;
    }
  }
};

export default Filter;
