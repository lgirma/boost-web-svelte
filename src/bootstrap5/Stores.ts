import {writable} from "svelte/store";
import type {ToastState, MessageBoxState, BusyModalState, ConfirmDialogState} from "boost-web";

const _msgBox = globalThis.c('message-box')
const _confirmDialog = globalThis.c('confirm-dialog')
const _busyModal = globalThis.c('busy-modal')
const _toast = globalThis.c('toast')

export const MessageBoxStore = writable<MessageBoxState>({isOpen: false})

export const ConfirmDialogStore = writable<ConfirmDialogState>({isOpen: false})

export const BusyModalStore = writable<BusyModalState>({isOpen: false})

export const ToastStore = writable<ToastState>({isOpen: false})

_msgBox.onToggle.subscribe(msg => {
    MessageBoxStore.set(msg)
})

_confirmDialog.onToggle.subscribe(msg => {
    ConfirmDialogStore.set(msg)
})

_busyModal.onToggle.subscribe(msg => {
    BusyModalStore.set(msg)
})

_toast.onToggle.subscribe(msg => {
    ToastStore.set(msg)
})