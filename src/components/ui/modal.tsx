import React from 'react'
import { Button } from './button'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    message: string
    type?: 'success' | 'error' | 'warning' | 'info'
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    showCancel?: boolean
}

export function Modal({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    confirmText = 'OK',
    cancelText = 'Batal',
    onConfirm,
    showCancel = false
}: ModalProps) {
    if (!isOpen) return null

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )
            case 'error':
                return (
                    <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )
            case 'warning':
                return (
                    <div className="w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                )
            default:
                return (
                    <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )
        }
    }

    const getButtonStyle = () => {
        switch (type) {
            case 'success':
                return 'bg-green-600 hover:bg-green-700 text-white'
            case 'error':
                return 'bg-red-600 hover:bg-red-700 text-white'
            case 'warning':
                return 'bg-yellow-600 hover:bg-yellow-700 text-white'
            default:
                return 'bg-blue-600 hover:bg-blue-700 text-white'
        }
    }

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm()
        }
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-all">
                <div className="text-center">
                    {getIcon()}

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {title}
                    </h3>

                    <p className="text-gray-600 mb-6">
                        {message}
                    </p>

                    <div className="flex gap-3 justify-center">
                        {showCancel && (
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="px-6"
                            >
                                {cancelText}
                            </Button>
                        )}

                        <Button
                            onClick={handleConfirm}
                            className={`px-6 ${getButtonStyle()}`}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Hook untuk menggunakan modal
export function useModal() {
    const [modal, setModal] = React.useState<{
        isOpen: boolean
        title: string
        message: string
        type: 'success' | 'error' | 'warning' | 'info'
        onConfirm?: () => void
        showCancel?: boolean
        confirmText?: string
        cancelText?: string
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    })

    const showModal = (options: {
        title: string
        message: string
        type?: 'success' | 'error' | 'warning' | 'info'
        onConfirm?: () => void
        showCancel?: boolean
        confirmText?: string
        cancelText?: string
    }) => {
        setModal({
            isOpen: true,
            type: 'info',
            ...options
        })
    }

    const closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }))
    }

    const showSuccess = (title: string, message: string) => {
        showModal({ title, message, type: 'success' })
    }

    const showError = (title: string, message: string) => {
        showModal({ title, message, type: 'error' })
    }

    const showWarning = (title: string, message: string) => {
        showModal({ title, message, type: 'warning' })
    }

    const showConfirm = (title: string, message: string, onConfirm: () => void) => {
        showModal({
            title,
            message,
            type: 'warning',
            onConfirm,
            showCancel: true,
            confirmText: 'Ya',
            cancelText: 'Batal'
        })
    }

    return {
        modal,
        showModal,
        closeModal,
        showSuccess,
        showError,
        showWarning,
        showConfirm,
        ModalComponent: () => (
            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onConfirm={modal.onConfirm}
                showCancel={modal.showCancel}
                confirmText={modal.confirmText}
                cancelText={modal.cancelText}
            />
        )
    }
} 