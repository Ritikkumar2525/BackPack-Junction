import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import User from '@/models/User';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { auth } from '@/auth';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const getStats = searchParams.get('stats');

    if (getStats === 'true') {
      // Get Statistics
      const totalPhotos = await Gallery.countDocuments({ mediaType: 'image' });
      const totalVideos = await Gallery.countDocuments({ mediaType: 'video' });
      
      const mostLiked = await Gallery.find().sort({ likes: -1 }).limit(5).populate('uploadedBy', 'name');
      
      const destinationStats = await Gallery.aggregate([
        { $group: { _id: '$destination', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);
      const mostViewedDestination = destinationStats.length > 0 ? destinationStats[0]._id : 'N/A';

      const contributorStats = await Gallery.aggregate([
        { $group: { _id: '$uploadedBy', uploads: { $sum: 1 } } },
        { $sort: { uploads: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
        { $project: { _id: 1, uploads: 1, name: '$user.name', email: '$user.email' } }
      ]);

      return NextResponse.json({
        totalPhotos,
        totalVideos,
        mostViewedDestination,
        mostLikedMemories: mostLiked,
        topContributors: contributorStats,
      });
    }

    // Get items
    const items = await Gallery.find().sort({ createdAt: -1 }).populate('uploadedBy', 'name email');
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title');
    const destination = formData.get('destination');
    const tripBatch = formData.get('tripBatch');
    const tags = formData.get('tags');
    const mediaType = formData.get('mediaType') || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    // Auto-detect resource_type ('image' or 'video')
    const cloudResult = await uploadToCloudinary(buffer, 'backpack_gallery', mediaType);

    // Create DB record
    const newMemory = await Gallery.create({
      title,
      destination,
      mediaType,
      url: cloudResult.secure_url,
      // For videos, Cloudinary can generate a thumbnail by changing extension to .jpg
      thumbnailUrl: mediaType === 'video' ? cloudResult.secure_url.replace(/\.[^/.]+$/, ".jpg") : cloudResult.secure_url,
      uploadedBy: session.user.id,
      tripBatch: tripBatch || '',
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      status: 'approved', // Admin uploads are auto-approved
      featured: formData.get('featured') === 'true',
    });

    return NextResponse.json(newMemory, { status: 201 });
  } catch (error) {
    console.error('Error uploading gallery item:', error);
    return NextResponse.json({ error: 'Failed to upload item' }, { status: 500 });
  }
}
