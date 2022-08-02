import React, { useRef, useEffect } from 'react'

export const CHECKED = 1
export const UNCHECKED = 2
export const INDETERMINATE = -1 

export default function Checkbox ({checkedValue}) {
    const checkRef = useRef();
  
    useEffect(() => {
      checkRef.current.checked = checkedValue === CHECKED
      checkRef.current.indeterminate = checkedValue === INDETERMINATE
    }, [status])
  
    return (
      <input
        type="checkbox"
        ref={checkRef}
      />
    )
  }