export function StrToFields({ strValue, text, valuePre = "", valuePost = "", children }: any) {
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

export function DateToFields({ dateStrValue, text, valuePre = "", valuePost = "" }: any) {
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

export function IntToFields({ intValue, text, valuePre = "", valuePost = "" }: any) {
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

export function StrIntToFields({ strValue, text, valuePre = "", valuePost = "" }: any) {
  let intValue = parseInt(strValue);
  return strValue ? (
    <IntToFields intValue={intValue} text={text} valuePre={valuePre} valuePost={valuePost} />
  ) : (
    <></>
  );
}
