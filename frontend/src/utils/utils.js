export const renderErrorMessage = (name, errorMessages, style = "text-yellow-400  font-semibold") =>
    errorMessages && errorMessages[name] && (<span className={style}>{errorMessages[name]}</span>);

export const renderSubErrorMessage = (name, subname, errorMessages, style = "text-yellow-400  font-semibold") =>
    errorMessages && errorMessages[name] && (<span className={style}>{errorMessages[name][subname]}</span>);
