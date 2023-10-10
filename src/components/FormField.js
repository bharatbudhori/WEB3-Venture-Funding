import React from 'react'

function FormField(
    { labelName, placeholder, inputType, value, handleChange }
) {
  return (
    <label className='flex-1 w-full flex flex-col'>
        {
            labelName && (
                <span className='font-epilogue'>
                    {labelName}
                </span>
            )
        }
    </label>
  )
}

export default FormField