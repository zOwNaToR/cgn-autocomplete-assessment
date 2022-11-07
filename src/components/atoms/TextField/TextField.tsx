import React from 'react'
import InputLabel from './TextFieldLabel'
import './styles.css'
import { cx } from '../../../utils/stringUtils'

type TextFieldProps = React.ComponentProps<'input'> & {
   label: string
   error?: string
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(({ label, error, ...props }, ref) => {
   const hasError = !!error

   return (
      <div className={cx("text-field-root", { "has-error": hasError, "disabled": props.disabled })}>
         <InputLabel>{label}</InputLabel>

         <div className="text-field-container">
            <input
               ref={ref}
               type="text"
               className="text-field"
               aria-label={label}
               {...props}
            />
         </div>
         {error && <p className="text-field-error">{error}</p>}
      </div>
   )
})

export default TextField