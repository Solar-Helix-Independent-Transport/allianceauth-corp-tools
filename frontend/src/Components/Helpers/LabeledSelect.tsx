import { ReactNode } from "react";

// A plain <h5>/<h6> label next to a select looks vertically centered in the
// markup, but Bootstrap's heading reset gives every heading a bottom-only
// margin (margin-top: 0, margin-bottom: 0.5rem) - under align-items-center
// that extra margin shifts the label upward relative to its sibling. A
// <span> carries no such margin, so it centers correctly against the select.
const LabeledSelect = ({ label, children }: { label: ReactNode; children: ReactNode }) => {
  return (
    <div className="m-3 d-flex align-items-center">
      <span className="me-2 fw-medium">{label}</span>
      <div className="flex-grow-1">{children}</div>
    </div>
  );
};

export default LabeledSelect;
