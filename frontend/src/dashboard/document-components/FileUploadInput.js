/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

export const INPUT_TYPES = {
    IMAGES: 'IMAGES',
    SHEETS: 'SHEETS',
    SHEETS_PDF: 'SHEETS_PDF',
    FINANCE: 'FINANCE'
}

const CONTENT_TYPES = {
    IMAGES: {
        'image/*': []
    },
    SHEETS: {
        'text/csv': [],
        'application/vnd.ms-excel': [],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
        'application/vnd.oasis.opendocument.spreadsheet': []
    },
    SHEETS_PDF: {
        'text/csv': [],
        'application/vnd.ms-excel': [],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
        'application/vnd.oasis.opendocument.spreadsheet': [],
        'application/pdf': []
    },
    FINANCE: {
        'text/csv': [],
        'application/vnd.ms-excel': [],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
        'application/pdf': []
    }
}

const FILE_DESCRIPTION = {
    IMAGES: 'Any Image (PNG, JPG)',
    SHEETS: 'Excel (XLS, CSV)',
    SHEETS_PDF: 'Excel (XLS, CSV), PDF, or ODF',
    FINANCE: 'Supported formats: Excel (XLS, CSV), PDF, or ODF'
}

const FileUploadInput = ({
    onChange,
    inputType = INPUT_TYPES.IMAGES,
    maxFiles = 12,
    maxSize = 2 * 1024 * 1024,
    resetFiles,
    customMaxFiles,
    customFileDescription,
    allowMultiple = true
}) => {
    const [files, setFiles] = useState([]);
    const [incorrectFiles, setIncorrectFiles] = useState([]);

    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    useEffect(() => {
        setFiles([]);
    }, [resetFiles]);

    const { getRootProps, getInputProps, fileRejections } = useDropzone({
        accept: CONTENT_TYPES[inputType],
        maxFiles: maxFiles,
        maxSize: maxSize,
        onDropRejected: rejectedFiles => {
            const allFiles = rejectedFiles.concat(incorrectFiles);
            const uniqueFiles = Array.from(new Map(allFiles.map(file => [`${file.name}-${file.size}`, file])).values());
            setIncorrectFiles(uniqueFiles);
        },
        onDrop: acceptedFiles => {
            const allFiles = acceptedFiles.concat(files);
            const uniqueFiles = Array.from(new Map(allFiles.map(file => [`${file.name}-${file.size}`, file])).values());

            if (inputType === INPUT_TYPES.IMAGES) {
                uniqueFiles.forEach(file => {
                    if (!file.preview) {
                        file.preview = URL.createObjectURL(file);
                    }
                });
            }

            setFiles(uniqueFiles);
            onChange(uniqueFiles);
        }
    });

    const handleRemoveFile = (fileToRemove) => {
        const updatedFiles = files.filter(file => file !== fileToRemove);
        setFiles(updatedFiles);
        onChange(updatedFiles);
        if (inputType === INPUT_TYPES.IMAGES && fileToRemove.preview) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
    };

    const getThumbnails = () => {
        return files.length > 0 && (
            <div className="flex items-center space-x-2 text-sm mt-2">
                <span className="font-semibold text-green-700">Files:</span>
                <ul className="flex flex-wrap items-center gap-2">
                    {files.map(file => (
                        <li key={`${file.name}-${file.size}`} className="flex items-center bg-gray-100 rounded px-2 py-1">
                            <span className="truncate max-w-xs">{file.name}</span>
                            <button
                                className="ml-2 text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveFile(file)}
                                aria-label={`Remove ${file.name}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const getRejectedItems = () => {
        return fileRejections.length > 0 && incorrectFiles.length > 0 && (
            <div className="text-xs text-red-500 mt-2">
                <span className="font-semibold">Rejected:</span>
                {incorrectFiles.map(({ file, errors }) => (
                    <span key={`${file.name}-${file.size}`} className="ml-1">
                        {file.name} ({errors[0].message})
                    </span>
                ))}
            </div>
        );
    };

    const thumbnails = useMemo(() => getThumbnails(), [files, inputType]);
    const rejectedItems = useMemo(() => getRejectedItems(), [incorrectFiles, fileRejections]);

    return (
        <div className="flex flex-col items-center my-10 max-w-md mx-auto">
            <div
                {...getRootProps({
                    className: 'w-full border-2 border-dashed border-green-400 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition-colors duration-300 bg-green-50'
                })}
            >
                <input {...getInputProps()} />
                <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-1 text-sm font-medium text-gray-900">
                    Drop {allowMultiple ? 'files' : 'a file'} or click to upload
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    {allowMultiple
                        ? `Max ${customMaxFiles || maxFiles} files, up to ${(maxSize / (1024 * 1024)).toFixed(2)} MB each`
                        : `One file, up to ${(maxSize / (1024 * 1024)).toFixed(2)} MB`
                    }
                </p>
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
                {inputType === INPUT_TYPES.FINANCE
                    ? FILE_DESCRIPTION.FINANCE
                    : `Supported Formats: ${customFileDescription || FILE_DESCRIPTION[inputType]}`
                }
            </p>
            {thumbnails}
            {rejectedItems}
        </div>
    );
}

export default FileUploadInput;
