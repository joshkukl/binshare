"use server";
import BASE_URL from '@/utils/baseURL';
import xss from 'xss';

/* 
    * used to prevent xss attacks
    * 
    * @param formData - FormData object
    * @returns errors - object with errors
    * @returns message - string with message
    * @returns isError - boolean with error status
    */
const sanitizeFormData = (formData: FormData): Record<string, string | string[] | boolean | undefined> => {
    const sanitizedData: Record<string, string | string[] | boolean | undefined> = {};
    const formValues = Object.fromEntries(formData);
    // Special case for tags because they are stored as an array
    const tags = formData.getAll('tags');
    //lets sanitize the form values
    for (const [key, value] of Object.entries(formValues)) {
        // skip the keys that are not needed
        if (Array.isArray(value) || key === 'tags') {
            continue;
        }
        if (value == null) {
            continue;
        }
        const sanitizedValue: string | string[] | boolean | undefined = xss(String(value));
        sanitizedData[key] = sanitizedValue ?? '';
    }
    // special case for tags because they are stored as an array
    if (tags.length > 0) {
        const sanitizedTags: string[] = [];
        for (const tag of tags) {
            if (typeof tag === 'string' && tag.trim() !== '') {
                const sanitizedTag = xss(tag);
                sanitizedTags.push(sanitizedTag);
            }
        }
        sanitizedData['tags'] = sanitizedTags;
    }
    // remove any empty values from the object
    Object.keys(sanitizedData).forEach((key) => {
        if (sanitizedData[key] === '' || sanitizedData[key] === undefined) {
            //console.log('removing key', key, ' sanitizedData[key] ', sanitizedData[key]);
            delete sanitizedData[key];
        }
    });
    return sanitizedData;
}
//MAKE THIS A TYPE LATER
interface PrevState {
    message: string;
    errors: Record<string, string | string[]>;
    isError: boolean;
}

const HandleSubmit = async(prevState: PrevState, formData: FormData) => {
    const type = await formData.get('type');
    // remove the type from the form data
    formData.delete('type');
    // sanitize the form data
    const formDataEntries = await sanitizeFormData(formData);
    async function handler(formDataEntries: Record<string, string | boolean | string[] | undefined>) {
        // create a request Init object
        const reqInit: RequestInit = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formDataEntries),
        };
        // Call the API to save the project
        const res = await fetch(BASE_URL + '/api/' + type, reqInit);
        // Check if the response is ok

        if (!res.ok) {
            const whyFail = await res.json();
            const failMessage: string = whyFail.message ? whyFail.message : 'Error: Failed to Save';
            //console.log('Actions Fail Message: ', failMessage);
            // reformat mongoose errors to fit heroui form validation
            const failErrors: Record<string, string | string[]> = whyFail.errors.errors ? (
                Object.keys(whyFail.errors.errors).reduce((acc: Record<string, string | string[]>, key: string) => {
                    const error = whyFail.errors.errors[key];
                    if (error && error.message) {
                        acc[key] = [error.message];
                    }
                    return acc;
                }
                    , {})) : (whyFail.errors ? whyFail.errors : {});
            prevState = { message: failMessage, errors: failErrors, isError: true };
            return prevState;
        }
        // Get the JSON response
        const response = await res.json();
        if (response.message) {
            return { message: response.message, errors: {}, isError: false };
        }
    }
    return handler(formDataEntries);
};
export default HandleSubmit;