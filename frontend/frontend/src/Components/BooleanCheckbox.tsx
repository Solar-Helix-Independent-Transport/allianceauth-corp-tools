import { Button } from "react-bootstrap";

export const BooleanCheckBox = ({ checked }: { checked: boolean }) => {
  return checked ? (
    <Button variant="success">
      <i className="fa-solid fa-check"></i>
    </Button>
  ) : (
    <Button variant="secondary">
      <i className="fa-solid fa-xmark"></i>
    </Button>
  );
};
