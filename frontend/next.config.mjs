/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/login/",
        destination: "http://localhost:8000/api/login/",
      },
      {
        source: "/api/register/",
        destination: "http://localhost:8000/api/register/",
      },
      {
        source: "/api/logout/",
        destination: "http://localhost:8000/api/logout/",
      },
      {
        source: "/api/auth/status/",
        destination: "http://localhost:8000/api/auth/status/",
      },
      {
        source: "/api/csrf/",
        destination: "http://localhost:8000/api/csrf/",
      },
      {
        source: "/api/favorite_studies/",
        destination: "http://localhost:8000/api/favorite_studies/",
      },
      {
        source: "/pmc/display/:pmcid.pdf",
        destination: "http://localhost:8000/pmc/display/:pmcid.pdf",
      },
      {
        source: "/api/annotated_studies/",
        destination: "http://localhost:8000/api/annotated_studies/",
      },
      {
        source: "/s3/uploadAnnotation/",
        destination: "http://localhost:8000/s3/uploadAnnotation/",
      },
      {
        source: "/s3/getAnnotations/",
        destination: "http://localhost:8000/s3/getAnnotations/",
      },
      {
        source: "/s3/deleteAnnotation/",
        destination: "http://localhost:8000/s3/deleteAnnotation/",
      },
      {
        source: "/llm/query/",
        destination: "http://localhost:8000/llm/query/",
      },
    ];
  },
  trailingSlash: true, // This helps preserve trailing slashes
};

export default nextConfig;
