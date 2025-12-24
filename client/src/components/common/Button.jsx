 const Button = ({
    children,
    type = 'button',
    onClick,
    disabled = false,
    className = ''
}) => {
    return (
        <button
            type ={type}
            onClick = {onClick}
            disabled = {disabled}
            className = {`
                px-4 py-2 rounded-md font-medium transition
                bg-navy-600 text-white hover:bg-navy-700
                disabled:bg-gray-400 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {children}
        </button>
    )
}

export default Button