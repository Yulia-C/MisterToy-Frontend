import { useEffect } from "react"

export function useColorSchemeListener() {

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateColorScheme = () => {

            if (mediaQuery.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
        updateColorScheme()

        mediaQuery.addEventListener('change', updateColorScheme)

        return () => {
            mediaQuery.removeEventListener('change', updateColorScheme)
        }

    }, [])
}

const customStyle = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'lightblue', // Change background color of the control
    borderColor: state.isFocused ? 'rgb(178 212 255)' : 'gray', // Change border color based on focus
    '&:hover': {
      borderColor: 'darkblue', // Change border color on hover
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'darkgreen' : (state.isFocused ? 'rgb(178 212 255)' : 'white'), // Change background color of options
  }),

};