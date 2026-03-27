import React from 'react'

const OTP_Input = ({ inputRefs }) => {

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    }

    const handleBack = (e, index) => {
        if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split("")
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char
            }
        })
    }

    return (
        <div className='flex gap-1 justify-center' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => {
                return (
                    <input
                        type="text"
                        maxLength='1'
                        key={index} required
                        className={`w-12 h-12 bg-slate-200 text-black text-center text-3xl rounded-md dark:bg-slate-700 dark:text-white`}
                        ref={e => inputRefs.current[index] = e}
                        onInput={(e) => handleInput(e, index)}
                        onKeyDown={(e) => handleBack(e, index)}
                    // autoFocus={index == 0 ? true : undefined}
                    />)
            })}
        </div>
    )
}

export default OTP_Input