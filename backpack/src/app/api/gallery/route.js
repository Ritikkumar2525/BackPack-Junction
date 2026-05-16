import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import { auth } from '@/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const featured = searchParams.get('featured') === 'true';
    const view = searchParams.get('view');

    let query = { status: 'approved' };
    
    // If the user wants to see their own uploads (dashboard)
    if (view === 'my-uploads') {
      const session = await auth();
      if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      query = { uploadedBy: session.user.id };
    } else if (featured) {
      query.featured = true;
    }

    const items = await Gallery.find(query).populate('uploadedBy', 'name').sort({ createdAt: -1 }).limit(limit);
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching public gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    await connectToDatabase();

    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title');
    const mediaType = formData.get('mediaType') || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const cloudResult = await uploadToCloudinary(buffer, 'backpack_gallery', mediaType);

    // Create DB record with 'pending' status
    const newMemory = await Gallery.create({
      title: title || 'User Upload',
      destination: 'Community',
      mediaType,
      url: cloudResult.secure_url,
      thumbnailUrl: mediaType === 'video' ? cloudResult.secure_url.replace(/\.[^/.]+$/, ".jpg") : cloudResult.secure_url,
      uploadedBy: session.user.id,
      status: 'pending', // Requires admin approval
      featured: false,
    });

    return NextResponse.json(newMemory, { status: 201 });
  } catch (error) {
    console.error('Error uploading gallery item:', error);
    return NextResponse.json({ error: 'Failed to upload item' }, { status: 500 });
  }
}
