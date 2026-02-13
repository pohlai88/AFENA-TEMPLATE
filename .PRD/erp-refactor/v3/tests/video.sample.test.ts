import { describe, it, expect } from 'vitest';
import { VideoSchema, VideoInsertSchema } from '../types/video.js';

describe('Video Zod validation', () => {
  const validSample = {
      "id": "TEST-Video-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "title": "Sample Title",
      "provider": "YouTube",
      "url": "Sample URL",
      "youtube_video_id": "Sample Youtube ID",
      "publish_date": "2024-01-15",
      "duration": 3600,
      "like_count": 1,
      "view_count": 1,
      "dislike_count": 1,
      "comment_count": 1,
      "description": "Sample text for description",
      "image": "/files/sample.png"
  };

  it('validates a correct Video object', () => {
    const result = VideoSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = VideoInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "title" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).title;
    const result = VideoSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = VideoSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
