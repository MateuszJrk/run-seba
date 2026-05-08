import { groq } from "next-sanity";

export const POST_FIELDS = groq`
  _id,
  _type,
  "slug": slug.current,
  title,
  description,
  date,
  tags,
  cover {
    ...,
    asset->{
      _id,
      url,
      metadata { dimensions, lqip }
    }
  }
`;

export const ALL_POSTS_QUERY = groq`
  *[_type == "post" && defined(slug.current)] | order(date desc) {
    ${POST_FIELDS}
  }
`;

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${POST_FIELDS},
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          _id,
          url,
          metadata { dimensions, lqip }
        }
      }
    }
  }
`;

export const ALL_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`;

export const ALL_TAGS_QUERY = groq`
  array::unique(*[_type == "post"].tags[])
`;

export const POSTS_BY_TAG_QUERY = groq`
  *[_type == "post" && $tag in tags && defined(slug.current)] | order(date desc) {
    ${POST_FIELDS}
  }
`;
