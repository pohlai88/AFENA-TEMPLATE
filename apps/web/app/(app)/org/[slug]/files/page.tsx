import { Card, CardContent, CardHeader, CardTitle } from 'afenda-ui/components/card';
import { FileUpload } from 'afenda-ui/components/file-upload';

/**
 * /org/[slug]/files — standalone file management page.
 * Uses the FileUpload component for drag-and-drop uploads.
 */
export default function FilesPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <h1 className="mb-6 text-2xl font-semibold">Files</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload a file</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload />
        </CardContent>
      </Card>
    </div>
  );
}
