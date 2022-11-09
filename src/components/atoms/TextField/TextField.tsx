import React, { useRef } from 'react'
import { cx } from '../../../utils/stringUtils'
import './styles.css'

type TextFieldProps = React.ComponentProps<'input'> & {
   label: string
   error?: string
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(({
   label,
   error,
   ...props
}, ref) => {
   const inputRef = useRef<HTMLInputElement | null>(null)

   const hasError = !!error
   const hasValue = !!inputRef.current?.value

   return (
      <div className={cx("text-field-root", {
         "has-error": hasError,
         "disabled": props.disabled,
      })}
      >
         <div className="text-field-wrapper">
            <input
               ref={(node) => {
                  inputRef.current = node;

                  if (typeof ref === 'function') {
                     ref(node);
                  } else if (ref) {
                     ref.current = node;
                  }
               }}
               type="text"
               className={cx("text-field", { "has-value": hasValue })}
               aria-label={label}
               {...props}
            />
            <label className="text-field-label">{label}</label>
         </div>
         {error && <p className="text-field-error">{error}</p>}
      </div>
   )
})

export default TextField