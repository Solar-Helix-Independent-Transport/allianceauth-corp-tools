import { ReactNode } from "react";

export function StrToFields({
  strValue,
  text,
  valuePre = "",
  valuePost = "",
  children,
}: {
  strValue?: string | number | null;
  text: string;
  valuePre?: string;
  valuePost?: string;
  children?: ReactNode;
}) {
  return strValue || children ? (
    <tr className="m-0">
      <td className="m-0">
        <p className="text-end m-0 py-0">{text}</p>
      </td>
      <td style={{ paddingLeft: "10px" }} className="m-0">
        {strValue && (
          <p className="m-0 py-0">
            {valuePre} {strValue} {valuePost}
          </p>
        )}
        {children}
      </td>
    </tr>
  ) : (
    <></>
  );
}

export function DateToFields({
  dateStrValue,
  text,
  valuePre = "",
  valuePost = "",
}: {
  dateStrValue?: string | null;
  text: string;
  valuePre?: string;
  valuePost?: string;
}) {
  return dateStrValue ? (
    <StrToFields
      strValue={new Date(dateStrValue).toLocaleString()}
      text={text}
      valuePre={valuePre}
      valuePost={valuePost}
    />
  ) : (
    <></>
  );
}

export function IntToFields({
  intValue,
  text,
  valuePre = "",
  valuePost = "",
}: {
  intValue: number;
  text: string;
  valuePre?: string;
  valuePost?: string;
}) {
  return intValue !== 0 ? (
    <StrToFields
      strValue={intValue.toLocaleString()}
      text={text}
      valuePre={valuePre}
      valuePost={valuePost}
    />
  ) : (
    <></>
  );
}

export function StrIntToFields({
  strValue,
  text,
  valuePre = "",
  valuePost = "",
}: {
  strValue?: string | number | null;
  text: string;
  valuePre?: string;
  valuePost?: string;
}) {
  const intValue = parseInt(String(strValue ?? ""));
  return strValue ? (
    <IntToFields intValue={intValue} text={text} valuePre={valuePre} valuePost={valuePost} />
  ) : (
    <></>
  );
}
