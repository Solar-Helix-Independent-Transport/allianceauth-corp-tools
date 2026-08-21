import { Form } from "react-bootstrap";
import type { SelectFilterOption } from "./SelectFilter";

// A plain <select class="form-select"> for filters that don't need
// react-select's search/async/multi-value features - relies entirely on
// Bootstrap's own .form-select styling rather than the CSS-variable
// overrides SelectFilter needs, so it inherits whatever the active theme
// does with core Bootstrap form classes, no reimplementation required here.
export const NativeSelectFilter = <T,>({
  setFilter,
  options,
  labelText,
}: {
  setFilter: (value: T) => void;
  options: SelectFilterOption<T>[];
  labelText: string;
}) => {
  return (
    <div className="flex-grow-1 flex-even d-flex text-nowrap">
      <div className="my-auto mx-2">
        <h6>{labelText}</h6>
      </div>
      <Form.Select
        className="m-2 flex-grow-1"
        defaultValue={0}
        onChange={(e) => {
          const option = options[Number(e.target.value)];
          if (option) setFilter(option.value);
        }}
      >
        {options.map((option, i) => (
          <option key={i} value={i}>
            {option.label}
          </option>
        ))}
      </Form.Select>
    </div>
  );
};
