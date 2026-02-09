'use client'

import { Field as ChakraField } from '@chakra-ui/react'
import { forwardRef } from 'react'

export const Field = forwardRef((props, ref) => {
  const { label, children, helperText, errorText, optionalText, ...rest } = props

  return (
    <ChakraField.Root ref={ref} {...rest}>
      {label && (
        <ChakraField.Label>
          {label}
          {optionalText && (
            <ChakraField.OptionalIndicator>{optionalText}</ChakraField.OptionalIndicator>
          )}
        </ChakraField.Label>
      )}
      {children}
      {helperText && <ChakraField.HelperText>{helperText}</ChakraField.HelperText>}
      {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
    </ChakraField.Root>
  )
})

Field.displayName = 'Field'
