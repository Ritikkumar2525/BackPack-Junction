import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to a general folder, e.g., 'backpack_general'
    const cloudResult = await uploadToCloudinary(buffer, 'backpack_general', 'auto');

    return NextResponse.json({ url: cloudResult.secure_url }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
