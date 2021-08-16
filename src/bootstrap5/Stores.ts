import {writable} from "svelte/store";
import type {ToastState, MessageBoxState, BusyModalState, ConfirmDialogState} from "boost-web";
import {onContainerInit} from 'boost-web'

/*const msgBox = lazyC('message-box')
const confirmDialog = lazyC('confirm-dialog')
const busyModal = lazyC('busy-modal')
const toast = lazyC('toast')*/

export const MessageBoxStore = writable<MessageBoxState>({isOpen: false})

export const ConfirmDialogStore = writable<ConfirmDialogState>({isOpen: false})

export const BusyModalStore = writable<BusyModalState>({isOpen: false})

export const ToastStore = writable<ToastState>({isOpen: false})

onContainerInit.subscribe(container => {
    container('message-box').onToggle.subscribe(msg => {
        MessageBoxStore.set(msg)
    })

    container('confirm-dialog').onToggle.subscribe(msg => {
        ConfirmDialogStore.set(msg)
    })

    container('busy-modal').onToggle.subscribe(msg => {
        BusyModalStore.set(msg)
    })

    container('toast').onToggle.subscribe(msg => {
        ToastStore.set(msg)
    })
})