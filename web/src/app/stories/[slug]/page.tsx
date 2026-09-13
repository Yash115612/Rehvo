import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateArticleSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { REHVO_STORIES } from '@/lib/seo/storiesData';
import { StoryViewerClient } from '@/components/seo/StoryViewerClient';

interface StoryPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return Object.keys(REHVO_STORIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const story = REHVO_STORIES[params.slug];
  if (!story) return {};

  return constructSeoMetadata({
    title: `${story.title} | REHVO Web Stories`,
    description: story.summary,
    canonicalUrl: `https://rehvo.in/stories/${params.slug}`,
    type: 'article',
    imageUrl: story.coverImage,
  });
}

export default function StoryViewerPage({ params }: StoryPageProps) {
  const story = REHVO_STORIES[params.slug];
  if (!story) notFound();

  const articleSchema = generateArticleSchema({
    title: story.title,
    description: story.summary,
    slug: `stories/${story.slug}`,
    publishDate: story.publishDate,
    imageUrl: story.coverImage,
    category: story.category,
  });

  return (
    <>
      <JsonLd data={articleSchema} />
      <StoryViewerClient story={story} />
    </>
  );
}
