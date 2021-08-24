import { SvelteComponentTyped } from "svelte"
import type {
    Size,
    MessageType,
    Dict,
    FieldConfig,
    ValidationResult,
    i18nTranslations,
    DataTableDataSource, DataTableColumn, DataTableFilter, DataTableOptionsFrom, CrudOptionsFrom
} from 'boost-web'
import {FormValidationResult, PartialFormConfig} from "boost-web";
import {columns, filter, selectableRows} from "./bootstrap5/DataTable.svelte";
import {
    createForm, createUrl,
    dataTable,
    detailUrl,
    filterForm,
    getFilter, name, namePlural, page, pageParams,
    rootUrl,
    updateForm,
    updateUrl
} from "./bootstrap5/Crud.svelte";

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

export declare const i18n_res_en: i18nTranslations
export declare const i18n_res_am: i18nTranslations

export class BS5DataTable extends SvelteComponentTyped<DataTableOptionsFrom, {}> {}

export type CrudProps = CrudOptionsFrom & {
    page?: string
    pageParams?: any
}

export class BS5Crud extends SvelteComponentTyped<CrudProps, {}> {}

export interface UploadableImageProps {
    id?: string
    icon?: string
    uploadUrl: string
}

export class BS5UploadableImage extends SvelteComponentTyped<{}, {}> {}

export class SecureFile extends SvelteComponentTyped<{id: string}, {}> {}