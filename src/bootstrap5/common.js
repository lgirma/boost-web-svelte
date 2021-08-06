import {MessageType} from 'boost-web'

export const TextColorTable = {
    [MessageType.NONE]: '',
    [MessageType.INFO]: '',
    [MessageType.SUCCESS]: 'text-success',
    [MessageType.WARNING]: 'text-warning',
    [MessageType.ERROR]: 'text-danger',
}

export const BgColorTable = {
    [MessageType.NONE]: '',
    [MessageType.INFO]: 'info',
    [MessageType.SUCCESS]: 'success',
    [MessageType.WARNING]: 'warning',
    [MessageType.ERROR]: 'danger',
}