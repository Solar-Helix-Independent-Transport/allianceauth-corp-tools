import styles from "./Loader.module.css";

export interface LoaderProps extends Partial<HTMLElement> {
  message?: string;
  title?: string;
}

export const LdsLoader = ({ className = "" }: { className?: string }) => {
  return <div className={className + " " + styles.ldsDualRing}></div>;
};

export const PanelLoader = (props: LoaderProps = { title: "Loading..." }) => {
  return (
    <div className={styles.flexContainer}>
      <div className="text-center">
        <LdsLoader />
        <h3>{props.title && props.title}</h3>
        <p>{props.message && props.message}</p>
      </div>
    </div>
  );
};

export const ErrorLoader = (props: LoaderProps = { title: "Error Loading Component" }) => {
  return (
    <div className={styles.flexContainer}>
      <div className="text-center">
        <div className={styles.errorAnim}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            fill="currentColor"
            className="bi bi-exclamation-triangle"
            viewBox="0 0 16 16"
          >
            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
          </svg>
        </div>
        <h3>{props.title && props.title}</h3>
        <p>{props.message && props.message}</p>
        <p></p>
      </div>
    </div>
  );
};

export const CorpLoader = (props: LoaderProps = { title: "Select Corporation" }) => {
  return (
    <div className={styles.flexContainer}>
      <div className="text-center">
        <div className={styles.arrorAnim}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            fill="currentColor"
            className="bi bi-arrow-up-short arrow-anim"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"
            />
          </svg>
        </div>
        <h3>{props.title && props.title}</h3>
        <p>{props.message && props.message}</p>
      </div>
    </div>
  );
};
