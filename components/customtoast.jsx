import { CheckCircle, AlertCircle, X } from "lucide-react"
import React from "react"
import { createPortal } from "react-dom"

const CustomToast = ({ message, type, isVisible, onClose }) => {
  if (!isVisible) return null

  return createPortal(
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[99999] transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-[400px] ${
          type === "success"
            ? "bg-green-50 border border-green-200 text-green-800"
            : "bg-red-50 border border-red-200 text-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
        )}
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={onClose}
          className={`flex-shrink-0 p-1 rounded-full hover:bg-opacity-20 ${
            type === "success" ? "hover:bg-green-600" : "hover:bg-red-600"
          }`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>,
    document.body // mounts outside modal root
  )
}

export default CustomToast
