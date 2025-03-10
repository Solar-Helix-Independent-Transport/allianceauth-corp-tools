import { FormControl } from "react-bootstrap";

export const TextFilter = ({ setFilterText, labelText }: any) => {
  return (
    <div className="flex-grow-1 flex-even d-flex text-nowrap">
      <div className="my-auto mx-2">
        <h6>{labelText}</h6>
      </div>
      <FormControl className="m-2" type="text" onChange={(e) => setFilterText(e.target.value)} />
    </div>
  );
};
