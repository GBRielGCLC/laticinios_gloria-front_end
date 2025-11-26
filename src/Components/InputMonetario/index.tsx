import { TextField, TextFieldProps } from "@mui/material";
import { NumericFormat, NumericFormatProps } from "react-number-format";

type InputMonetarioProps = NumericFormatProps<TextFieldProps>;

export function InputMonetario(props: InputMonetarioProps) {
    return (
        <NumericFormat
            {...props}
            value={props.value ?? ""}
            customInput={TextField}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            prefix="R$ "
        />
    );
}
