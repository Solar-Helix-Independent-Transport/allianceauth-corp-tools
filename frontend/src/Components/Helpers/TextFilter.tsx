import { Form, FormControl } from "react-bootstrap";

export const TextFilter = ({ setFilterText, labelText }: any) => {
  return (
    <div className="flex-grow-1 flex-even d-flex text-nowrap">
      <div className="my-auto mx-2">
        <Form.Label className="m-0 p-0">{labelText}</Form.Label>
      </div>
      <FormControl className="m-2" type="text" onChange={(e) => setFilterText(e.target.value)} />
    </div>
  );
};
