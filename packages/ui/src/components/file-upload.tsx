'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const ALLOWED_CONTENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/json',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

interface FileUploadProps {
  onUploadComplete?: (file: UploadedFile) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
}

interface UploadedFile {
  objectKey: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  publicFileUrl: string | null;
}

type UploadState =
  | { status: 'idle' }
  | { status: 'validating' }
  | { status: 'presigning' }
  | { status: 'uploading'; progress: number }
  | { status: 'saving' }
  | { status: 'done'; file: UploadedFile }
  | { status: 'error'; message: string };

function FileUpload({
  onUploadComplete,
  onError,
  accept,
  maxSize = MAX_FILE_SIZE,
  className,
  disabled = false,
}: FileUploadProps) {
  const [state, setState] = React.useState<UploadState>({ status: 'idle' });
  const [isDragOver, setIsDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function validateFile(file: File): string | null {
    if (!ALLOWED_CONTENT_TYPES.has(file.type)) {
      return `File type "${file.type}" is not allowed`;
    }
    if (file.size > maxSize) {
      return `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`;
    }
    return null;
  }

  async function handleFile(file: File) {
    if (disabled) return;

    // Validate
    setState({ status: 'validating' });
    const error = validateFile(file);
    if (error) {
      setState({ status: 'error', message: error });
      onError?.(error);
      return;
    }

    try {
      // Presign
      setState({ status: 'presigning' });
      const presignRes = await fetch('/api/storage/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      });

      if (!presignRes.ok) {
        const body = await presignRes.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Failed to get upload URL');
      }

      const { presignedUrl, objectKey, publicFileUrl } = (await presignRes.json()) as {
        presignedUrl: string;
        objectKey: string;
        publicFileUrl: string | null;
      };

      // Upload to R2 with progress tracking
      setState({ status: 'uploading', progress: 0 });
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            setState({ status: 'uploading', progress: Math.round((e.loaded / e.total) * 100) });
          }
        });
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));
        xhr.open('PUT', presignedUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      // Save metadata (idempotent)
      setState({ status: 'saving' });
      const metaRes = await fetch('/api/storage/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectKey,
          publicFileUrl,
          fileName: file.name,
          contentType: file.type,
          sizeBytes: file.size,
        }),
      });

      if (!metaRes.ok) {
        throw new Error('Failed to save file metadata');
      }

      const uploaded: UploadedFile = {
        objectKey,
        fileName: file.name,
        contentType: file.type,
        sizeBytes: file.size,
        publicFileUrl,
      };

      setState({ status: 'done', file: uploaded });
      onUploadComplete?.(uploaded);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setState({ status: 'error', message });
      onError?.(message);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  }

  function reset() {
    setState({ status: 'idle' });
  }

  const isUploading = state.status === 'uploading' || state.status === 'presigning' || state.status === 'saving' || state.status === 'validating';

  return (
    <div
      data-slot="file-upload"
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
        isDragOver && 'border-primary bg-primary/5',
        state.status === 'error' && 'border-destructive bg-destructive/5',
        state.status === 'done' && 'border-green-500 bg-green-500/5',
        !isDragOver && state.status !== 'error' && state.status !== 'done' && 'border-muted-foreground/25 hover:border-muted-foreground/50',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {state.status === 'idle' && (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="text-muted-foreground text-sm">
            Drag & drop a file here, or{' '}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-primary underline-offset-4 hover:underline"
            >
              browse
            </button>
          </div>
          <p className="text-muted-foreground/60 text-xs">
            Max {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      )}

      {isUploading && (
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-muted-foreground text-sm">
            {state.status === 'validating' && 'Validating...'}
            {state.status === 'presigning' && 'Preparing upload...'}
            {state.status === 'uploading' && `Uploading... ${state.progress}%`}
            {state.status === 'saving' && 'Saving metadata...'}
          </p>
          {state.status === 'uploading' && (
            <div className="bg-primary/20 h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full transition-all duration-200"
                style={{ width: `${state.progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {state.status === 'done' && (
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            Upload complete
          </p>
          <p className="text-muted-foreground max-w-[200px] truncate text-xs">
            {state.file.fileName}
          </p>
          <button
            type="button"
            onClick={reset}
            className="text-primary text-xs underline-offset-4 hover:underline"
          >
            Upload another
          </button>
        </div>
      )}

      {state.status === 'error' && (
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-destructive text-sm">{state.message}</p>
          <button
            type="button"
            onClick={reset}
            className="text-primary text-xs underline-offset-4 hover:underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

export { FileUpload, ALLOWED_CONTENT_TYPES, MAX_FILE_SIZE };
export type { FileUploadProps, UploadedFile, UploadState };
