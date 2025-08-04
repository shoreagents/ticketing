# Supabase Storage Setup

To enable file uploads, you need to create a storage bucket in your Supabase project.

## Steps to Set Up Storage:

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `sanljwkkoawwdpaxrper`

2. **Create Storage Bucket**
   - Navigate to Storage in the left sidebar
   - Click "Create a new bucket"
   - Bucket name: `ticket-files`
   - Make it public (so files can be accessed via URL)
   - Click "Create bucket"

3. **Set Storage Policies**
   - Go to Storage > Policies
   - For the `ticket-files` bucket, add these policies:

### Upload Policy:
```sql
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'ticket-files' AND 
  auth.role() = 'authenticated'
);
```

### Download Policy:
```sql
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'ticket-files');
```

4. **Test the Setup**
   - Try uploading a file through the form
   - Check the browser console for any errors
   - Files should be uploaded to Supabase Storage and URLs saved in the database

## File Upload Features:
- ✅ Files are uploaded to Supabase Storage
- ✅ Unique filenames prevent conflicts
- ✅ Public URLs are generated for file access
- ✅ File paths are saved in the ticket record
- ✅ Supports: PNG, JPG, PDF, DOC, DOCX
- ✅ Maximum file size: 10MB per file

## Troubleshooting:
- If you get "bucket not found" errors, make sure the bucket name is exactly `ticket-files`
- If uploads fail, check that the storage policies are set correctly
- Check the browser console and server logs for detailed error messages 