import React from 'react'
import { ReactComponent as DeleteIconSvg } from '../../icons/delete-icon.svg'
import { cx } from '../../utils/stringUtils'

const DeleteIcon = ({
   width = 25,
   height = 25,
   className = "",
   ...props
}: React.ComponentProps<typeof DeleteIconSvg>) => {
   return <DeleteIconSvg 
      {...props}
      width={width}
      height={height}
      className={cx("cursor-pointer", className)}
      data-testid="delete-icon"
   />
}

export default DeleteIcon