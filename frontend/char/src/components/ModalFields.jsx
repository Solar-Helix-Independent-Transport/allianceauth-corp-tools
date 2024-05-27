import React from "react";

export function StrToFields({ strValue, text, valuePre = "", valuePost = "", children }) {
  //console.log("StrToFields", strValue, text);
  return strValue || children ? (
    <tr>
      <td>
        <p className="text-right">{text}</p>
      </td>
      <td style={{ paddingLeft: "10px" }}>
        {strValue && (
          <p>
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

export function DateToFields({ dateStrValue, text, valuePre = "", valuePost = "" }) {
  //console.log("IntToFields", intValue, text);
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

export function IntToFields({ intValue, text, valuePre = "", valuePost = "" }) {
  //console.log("IntToFields", intValue, text);
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

export function StrIntToFields({ strValue, text, valuePre = "", valuePost = "" }) {
  //console.log("StrIntToFields", strValue, text);
  let intValue = parseInt(strValue);
  return strValue ? (
    <IntToFields intValue={intValue} text={text} valuePre={valuePre} valuePost={valuePost} />
  ) : (
    <></>
  );
}
