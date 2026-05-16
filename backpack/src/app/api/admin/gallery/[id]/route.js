import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { auth } from '@/auth';

export async function PUT(request, props) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const params = await props.params;
    const { id } = params;
    const data = await request.json();

    const updatedItem = await Gallery.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: "after" }
    ).populate('uploadedBy', 'name email');

    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request, props) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const params = await props.params;
    const { id } = params;
    const item = await Gallery.findById(id);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Extract Cloudinary public ID from URL
    // Format usually: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder_name/public_id.jpg
    try {
      const urlParts = item.url.split('/');
      const filenameWithExtension = urlParts[urlParts.length - 1];
      const folderName = urlParts[urlParts.length - 2];
      const publicId = `${folderName}/${filenameWithExtension.split('.')[0]}`;
      
      await deleteFromCloudinary(publicId, item.mediaType);
    } catch (cloudinaryError) {
      console.error('Error removing from cloudinary, proceeding to DB delete:', cloudinaryError);
    }

    await Gallery.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
