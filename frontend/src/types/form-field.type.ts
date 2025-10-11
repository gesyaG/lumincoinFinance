export type FormFieldType = {
    name: string,
    id: string,
    element: HTMLInputElement | null,
    regex: RegExp | null,
    valid: boolean,
}