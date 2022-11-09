import React from 'react'
import useInputRef from '../../../hooks/useInputRef/useInputRef'
import { cx } from '../../../utils/stringUtils'
import './styles.css'

type TextFieldProps = React.ComponentProps<'input'> & {
   label: string
   error?: string
   endAdornment?: React.ReactNode
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(({
   label,
   error,
   endAdornment,
   ...props
}, ref) => {
   const inputRef = useInputRef({ forwardRef: ref })

   const hasError = !!error
   const hasValue = !!inputRef.getValue()

   return (
      <div className={cx("text-field-root", {
         "has-error": hasError,
         "disabled": props.disabled,
      })}
      >
         <div className="text-field-wrapper">
            <input
               ref={inputRef.register}
               type="text"
               className={cx("text-field", { "has-value": hasValue })}
               aria-label={label}
               {...props}
            />
            {endAdornment && (
               <div className='text-field-end-icon'>
                  {endAdornment}
               </div>
            )}
            <label className="text-field-label">{label}</label>
         </div>
         {error && <p className="text-field-error">{error}</p>}
      </div>
   )
})

export default TextField