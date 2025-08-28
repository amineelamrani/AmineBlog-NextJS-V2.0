import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL(
        "http://res.cloudinary.com/dntdxqzsw/image/upload/v1741683505/blog/ProfilePictures/**"
      ),
      new URL(
        "http://res.cloudinary.com/dntdxqzsw/image/upload/w_1000/q_35/f_auto/**"
      ),
      new URL("http://res.cloudinary.com/dntdxqzsw/image/upload/**"),
      new URL("https://img.icons8.com"),
    ],
  },
};

export default nextConfig;
