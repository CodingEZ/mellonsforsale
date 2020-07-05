// Can be used for debugging. Used in case Javascript is modified.
function alertModified(message) {
    alert(`Javascript was modified. ${message}`);
}

function ajaxFailure(xhr, status, errorThrown) {
    alert("Sorry, there was a problem!");
    console.log(`Error: ${errorThrown}`);
    console.log(`Status: ${status}`);
    console.dir(xhr);
}

function getCSRFToken() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const c = cookies[i].trim();
        if (c.startsWith("csrftoken=")) {
            return c.substring("csrftoken=".length, c.length);
        }
    }
    return "unknown";
}

function removeNonDigit(str) {
    return str.replace(/\D/g, "");
}

export {
    alertModified, ajaxFailure, getCSRFToken, removeNonDigit
};
