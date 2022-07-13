export const Common = {          
    isValidField
};

function isValidField(value) {
    if (value === "" || value === null || value === 'null' || value === 'NA' || value === " " || value === undefined || value === "NULL" || value === []
    ) {
        return false
    } else {
        return true
    }
}
