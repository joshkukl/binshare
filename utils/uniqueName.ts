/** @file 
 * Will generate a unique string for anything that needs a unique name.
 * @param {number} length - The length of the unique string to be generated.
 * @returns {string} result -  A unique string without special characters.
 */


// This function will generate a unique string for anything that needs a unique name.
const uniqueName = (length: number): string => {
    let result = '';
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charlength: number = characters.length;
    let counter = 0;
    while(counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charlength));
        counter ++;
    }
    return result;
}


export default uniqueName;