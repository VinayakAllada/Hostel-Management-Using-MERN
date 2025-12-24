export const getErrorMessage = (error, fallback = 'Something went wrong') => {
    if(!error) return fallback;

    if(error.response && error.response.data){
        return (
            error.response.data.message ||
            error.response.data.error ||
            fallback
        )
    }

    if(error.message) return error.message

    return fallback
}