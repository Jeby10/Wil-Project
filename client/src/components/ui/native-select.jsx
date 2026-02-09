'use client'

import { NativeSelect as ChakraNativeSelect, Portal } from '@chakra-ui/react'
import { forwardRef } from 'react'

export const NativeSelectRoot = forwardRef((props, ref) => {
  return <ChakraNativeSelect.Root ref={ref} {...props} />
})

NativeSelectRoot.displayName = 'NativeSelectRoot'

export const NativeSelectField = forwardRef((props, ref) => {
  return <ChakraNativeSelect.Field ref={ref} {...props} />
})

NativeSelectField.displayName = 'NativeSelectField'

export const NativeSelectIndicator = forwardRef((props, ref) => {
  return (
    <ChakraNativeSelect.Indicator ref={ref} {...props}>
      {props.children}
    </ChakraNativeSelect.Indicator>
  )
})

NativeSelectIndicator.displayName = 'NativeSelectIndicator'
