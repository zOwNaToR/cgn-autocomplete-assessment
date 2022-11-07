import React from 'react'

type InputLabelProps = React.PropsWithChildren & {

}

const InputLabel = ({ children }: InputLabelProps) => {
   return (
      <label className="text-field-label">{children}</label>
   )
}

export default InputLabel