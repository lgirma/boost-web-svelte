import { SvelteComponentTyped } from "svelte"
import type {Size, MessageType, Dict, FieldConfig, ValidationResult} from 'boost-web'
import {FormValidationResult, PartialFormConfig} from "boost-web";
import {updateConfigOnValueChange} from "./bootstrap5/Form.svelte";
import {classes, max, style} from "./misc/Rating.svelte";

export interface BS5ModalProps {
    id: string
    size: Size
    noHeader?: boolean
    noFooter?: boolean
}

export class BS5Modal extends SvelteComponentTyped<BS5ModalProps, {}> {}

export interface FaIconProps {
    type?: 'solid' | 'regular' | 'brand'
    messageType?: MessageType
    key?: string
    spin?: boolean
}

export class FaIcon extends SvelteComponentTyped<FaIconProps, {}> {}

export class BS5MessageBox extends SvelteComponentTyped<{}, {}> {}
export class BS5ConfirmDialogBox extends SvelteComponentTyped<{}, {}> {}
export class BS5BusyModal extends SvelteComponentTyped<{}, {}> {}

export interface FormFieldProps {
    value: any
    config: FieldConfig
    validationResult?: ValidationResult
}

export class BS5FormField extends SvelteComponentTyped<FormFieldProps, {}> {}

export interface FormProps {
    forObj: Dict<any>
    formConfig?: PartialFormConfig
    validationResult?: FormValidationResult
    updateConfigOnValueChange?: boolean
}

export class BS5Form extends SvelteComponentTyped<FormProps, {}> {}
export class LangLinks extends SvelteComponentTyped<{}, {}> {}

export interface RatingProps {
    max?: number
    value: number
    classes?: string
    style?: string
}
export class Rating extends SvelteComponentTyped<RatingProps, {}> {}