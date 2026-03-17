const CLOUDINARY_CLOUD_NAME = "doh2vn9zn";

export function cloudinaryImage(
  publicId: string,
  transformations = "f_auto,q_auto"
) {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
}

export function cloudinaryFetch(
  sourceUrl: string,
  transformations = "f_auto,q_auto"
) {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transformations}/${encodeURIComponent(sourceUrl)}`;
}

export const cloudinaryImages = {
  authBackground: cloudinaryImage("v1773693574/new3_liydsg.png", "f_auto,q_auto,w_1600"),
  footerFeature: cloudinaryImage("v1773691111/slider_3_v0fzgs.png", "f_auto,q_auto,w_900"),
  heroSlideOne: cloudinaryImage("v1773692504/new1_m8z7aj.png", "f_auto,q_auto,w_1600"),
  heroSlideTwo: cloudinaryImage("v1773693574/new3_liydsg.png", "f_auto,q_auto,w_1600"),
  ugFlag: cloudinaryFetch(
    "https://flagcdn.com/ug.svg",
    "f_auto,q_auto,w_64,h_48,c_fill"
  ),
  productOne: cloudinaryFetch(
    "https://images.unsplash.com/photo-1647283103551-3cf936496425?q=80&w=800&auto=format&fit=crop",
    "f_auto,q_auto,w_400,h_400,c_fill"
  ),
  productTwo: cloudinaryFetch(
    "https://images.unsplash.com/photo-1589310243389-96a5483d2390?q=80&w=800&auto=format&fit=crop",
    "f_auto,q_auto,w_400,h_400,c_fill"
  ),
  productThree: cloudinaryFetch(
    "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop",
    "f_auto,q_auto,w_400,h_400,c_fill"
  ),
  productFour: cloudinaryFetch(
    "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=800&auto=format&fit=crop",
    "f_auto,q_auto,w_400,h_400,c_fill"
  ),
} as const;
