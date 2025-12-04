/**
 * DSRT Graphics Engine Constants
 * @module Constants
 */

/**
 * Engine version
 * @constant {string}
 */
export const VERSION = '1.0.0';

/**
 * Mouse button and interaction constants
 * @constant {Object}
 * @property {number} LEFT - Left mouse button
 * @property {number} MIDDLE - Middle mouse button
 * @property {number} RIGHT - Right mouse button
 * @property {number} ROTATE - Rotate interaction
 * @property {number} DOLLY - Dolly (zoom) interaction
 * @property {number} PAN - Pan interaction
 */
export const MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2, ROTATE: 0, DOLLY: 1, PAN: 2 };

/**
 * Touch interaction constants
 * @constant {Object}
 * @property {number} ROTATE - Rotate interaction
 * @property {number} PAN - Pan interaction
 * @property {number} DOLLY_PAN - Combined dolly and pan
 * @property {number} DOLLY_ROTATE - Combined dolly and rotate
 */
export const TOUCH = { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 };

/**
 * Face culling constants
 * @constant {number} CULL_NONE - No face culling
 * @constant {number} CULL_BACK - Cull back faces
 * @constant {number} CULL_FRONT - Cull front faces
 * @constant {number} CULL_FRONT_BACK - Cull both front and back faces
 */
export const CULL_NONE = 0;
export const CULL_BACK = 1;
export const CULL_FRONT = 2;
export const CULL_FRONT_BACK = 3;

/**
 * Shadow mapping constants
 * @constant {number} SHADOW_BASIC - Basic unfiltered shadows
 * @constant {number} SHADOW_PCF - Percentage-Closer Filtering
 * @constant {number} SHADOW_PCF_SOFT - Soft PCF shadows
 * @constant {number} SHADOW_VSM - Variance Shadow Mapping
 */
export const SHADOW_BASIC = 0;
export const SHADOW_PCF = 1;
export const SHADOW_PCF_SOFT = 2;
export const SHADOW_VSM = 3;

/**
 * Material side constants
 * @constant {number} SIDE_FRONT - Render front side only
 * @constant {number} SIDE_BACK - Render back side only
 * @constant {number} SIDE_DOUBLE - Render both sides
 */
export const SIDE_FRONT = 0;
export const SIDE_BACK = 1;
export const SIDE_DOUBLE = 2;

/**
 * Blending mode constants
 * @constant {number} BLEND_NONE - No blending
 * @constant {number} BLEND_NORMAL - Normal blending
 * @constant {number} BLEND_ADDITIVE - Additive blending
 * @constant {number} BLEND_SUBTRACTIVE - Subtractive blending
 * @constant {number} BLEND_MULTIPLY - Multiply blending
 * @constant {number} BLEND_CUSTOM - Custom blending
 */
export const BLEND_NONE = 0;
export const BLEND_NORMAL = 1;
export const BLEND_ADDITIVE = 2;
export const BLEND_SUBTRACTIVE = 3;
export const BLEND_MULTIPLY = 4;
export const BLEND_CUSTOM = 5;

/**
 * Blending equation constants
 * @constant {number} BLEND_EQUATION_ADD - Source + destination
 * @constant {number} BLEND_EQUATION_SUBTRACT - Source - destination
 * @constant {number} BLEND_EQUATION_REVERSE_SUBTRACT - Destination - source
 * @constant {number} BLEND_EQUATION_MIN - Minimum of source and destination
 * @constant {number} BLEND_EQUATION_MAX - Maximum of source and destination
 */
export const BLEND_EQUATION_ADD = 100;
export const BLEND_EQUATION_SUBTRACT = 101;
export const BLEND_EQUATION_REVERSE_SUBTRACT = 102;
export const BLEND_EQUATION_MIN = 103;
export const BLEND_EQUATION_MAX = 104;

/**
 * Blending factor constants
 * @constant {number} BLEND_FACTOR_ZERO - Multiply by 0
 * @constant {number} BLEND_FACTOR_ONE - Multiply by 1
 * @constant {number} BLEND_FACTOR_SRC_COLOR - Multiply by source color
 * @constant {number} BLEND_FACTOR_ONE_MINUS_SRC_COLOR - Multiply by 1 - source color
 * @constant {number} BLEND_FACTOR_SRC_ALPHA - Multiply by source alpha
 * @constant {number} BLEND_FACTOR_ONE_MINUS_SRC_ALPHA - Multiply by 1 - source alpha
 * @constant {number} BLEND_FACTOR_DST_ALPHA - Multiply by destination alpha
 * @constant {number} BLEND_FACTOR_ONE_MINUS_DST_ALPHA - Multiply by 1 - destination alpha
 * @constant {number} BLEND_FACTOR_DST_COLOR - Multiply by destination color
 * @constant {number} BLEND_FACTOR_ONE_MINUS_DST_COLOR - Multiply by 1 - destination color
 * @constant {number} BLEND_FACTOR_SRC_ALPHA_SATURATE - Source alpha saturation
 * @constant {number} BLEND_FACTOR_CONSTANT_COLOR - Multiply by constant color
 * @constant {number} BLEND_FACTOR_ONE_MINUS_CONSTANT_COLOR - Multiply by 1 - constant color
 * @constant {number} BLEND_FACTOR_CONSTANT_ALPHA - Multiply by constant alpha
 * @constant {number} BLEND_FACTOR_ONE_MINUS_CONSTANT_ALPHA - Multiply by 1 - constant alpha
 */
export const BLEND_FACTOR_ZERO = 200;
export const BLEND_FACTOR_ONE = 201;
export const BLEND_FACTOR_SRC_COLOR = 202;
export const BLEND_FACTOR_ONE_MINUS_SRC_COLOR = 203;
export const BLEND_FACTOR_SRC_ALPHA = 204;
export const BLEND_FACTOR_ONE_MINUS_SRC_ALPHA = 205;
export const BLEND_FACTOR_DST_ALPHA = 206;
export const BLEND_FACTOR_ONE_MINUS_DST_ALPHA = 207;
export const BLEND_FACTOR_DST_COLOR = 208;
export const BLEND_FACTOR_ONE_MINUS_DST_COLOR = 209;
export const BLEND_FACTOR_SRC_ALPHA_SATURATE = 210;
export const BLEND_FACTOR_CONSTANT_COLOR = 211;
export const BLEND_FACTOR_ONE_MINUS_CONSTANT_COLOR = 212;
export const BLEND_FACTOR_CONSTANT_ALPHA = 213;
export const BLEND_FACTOR_ONE_MINUS_CONSTANT_ALPHA = 214;

/**
 * Depth test constants
 * @constant {number} DEPTH_NEVER - Never pass
 * @constant {number} DEPTH_ALWAYS - Always pass
 * @constant {number} DEPTH_LESS - Pass if less than
 * @constant {number} DEPTH_LESS_EQUAL - Pass if less than or equal
 * @constant {number} DEPTH_EQUAL - Pass if equal
 * @constant {number} DEPTH_GREATER_EQUAL - Pass if greater than or equal
 * @constant {number} DEPTH_GREATER - Pass if greater than
 * @constant {number} DEPTH_NOT_EQUAL - Pass if not equal
 */
export const DEPTH_NEVER = 0;
export const DEPTH_ALWAYS = 1;
export const DEPTH_LESS = 2;
export const DEPTH_LESS_EQUAL = 3;
export const DEPTH_EQUAL = 4;
export const DEPTH_GREATER_EQUAL = 5;
export const DEPTH_GREATER = 6;
export const DEPTH_NOT_EQUAL = 7;

/**
 * Tone mapping constants
 * @constant {number} TONE_MAPPING_NONE - No tone mapping
 * @constant {number} TONE_MAPPING_LINEAR - Linear tone mapping
 * @constant {number} TONE_MAPPING_REINHARD - Reinhard tone mapping
 * @constant {number} TONE_MAPPING_CINEON - Cineon tone mapping
 * @constant {number} TONE_MAPPING_ACES_FILMIC - ACES Filmic tone mapping
 * @constant {number} TONE_MAPPING_CUSTOM - Custom tone mapping
 * @constant {number} TONE_MAPPING_AGX - AgX tone mapping
 * @constant {number} TONE_MAPPING_NEUTRAL - Neutral tone mapping
 */
export const TONE_MAPPING_NONE = 0;
export const TONE_MAPPING_LINEAR = 1;
export const TONE_MAPPING_REINHARD = 2;
export const TONE_MAPPING_CINEON = 3;
export const TONE_MAPPING_ACES_FILMIC = 4;
export const TONE_MAPPING_CUSTOM = 5;
export const TONE_MAPPING_AGX = 6;
export const TONE_MAPPING_NEUTRAL = 7;

/**
 * Skinned mesh bind mode constants
 * @constant {string} BIND_MODE_ATTACHED - Mesh shares world space with skeleton
 * @constant {string} BIND_MODE_DETACHED - Mesh has separate world space
 */
export const BIND_MODE_ATTACHED = 'attached';
export const BIND_MODE_DETACHED = 'detached';

/**
 * Texture mapping constants
 * @constant {number} MAPPING_UV - UV coordinate mapping
 * @constant {number} MAPPING_CUBE_REFLECTION - Cube reflection mapping
 * @constant {number} MAPPING_CUBE_REFRACTION - Cube refraction mapping
 * @constant {number} MAPPING_EQUIRECTANGULAR_REFLECTION - Equirectangular reflection
 * @constant {number} MAPPING_EQUIRECTANGULAR_REFRACTION - Equirectangular refraction
 * @constant {number} MAPPING_CUBE_UV_REFLECTION - Cube UV reflection mapping
 */
export const MAPPING_UV = 300;
export const MAPPING_CUBE_REFLECTION = 301;
export const MAPPING_CUBE_REFRACTION = 302;
export const MAPPING_EQUIRECTANGULAR_REFLECTION = 303;
export const MAPPING_EQUIRECTANGULAR_REFRACTION = 304;
export const MAPPING_CUBE_UV_REFLECTION = 306;

/**
 * Texture wrapping constants
 * @constant {number} WRAP_REPEAT - Repeat wrapping
 * @constant {number} WRAP_CLAMP_TO_EDGE - Clamp to edge wrapping
 * @constant {number} WRAP_MIRRORED_REPEAT - Mirrored repeat wrapping
 */
export const WRAP_REPEAT = 1000;
export const WRAP_CLAMP_TO_EDGE = 1001;
export const WRAP_MIRRORED_REPEAT = 1002;

/**
 * Texture filtering constants
 * @constant {number} FILTER_NEAREST - Nearest neighbor filtering
 * @constant {number} FILTER_NEAREST_MIPMAP_NEAREST - Nearest mipmap nearest
 * @constant {number} FILTER_NEAREST_MIPMAP_LINEAR - Nearest mipmap linear
 * @constant {number} FILTER_LINEAR - Linear filtering
 * @constant {number} FILTER_LINEAR_MIPMAP_NEAREST - Linear mipmap nearest
 * @constant {number} FILTER_LINEAR_MIPMAP_LINEAR - Linear mipmap linear
 */
export const FILTER_NEAREST = 1003;
export const FILTER_NEAREST_MIPMAP_NEAREST = 1004;
export const FILTER_NEAREST_MIPMAP_LINEAR = 1005;
export const FILTER_LINEAR = 1006;
export const FILTER_LINEAR_MIPMAP_NEAREST = 1007;
export const FILTER_LINEAR_MIPMAP_LINEAR = 1008;

/**
 * Data type constants for textures
 * @constant {number} TYPE_UNSIGNED_BYTE - Unsigned byte (8-bit)
 * @constant {number} TYPE_BYTE - Signed byte (8-bit)
 * @constant {number} TYPE_SHORT - Signed short (16-bit)
 * @constant {number} TYPE_UNSIGNED_SHORT - Unsigned short (16-bit)
 * @constant {number} TYPE_INT - Signed integer (32-bit)
 * @constant {number} TYPE_UNSIGNED_INT - Unsigned integer (32-bit)
 * @constant {number} TYPE_FLOAT - Float (32-bit)
 * @constant {number} TYPE_HALF_FLOAT - Half float (16-bit)
 * @constant {number} TYPE_UNSIGNED_SHORT_4444 - Packed 4-4-4-4 (16-bit)
 * @constant {number} TYPE_UNSIGNED_SHORT_5551 - Packed 5-5-5-1 (16-bit)
 * @constant {number} TYPE_UNSIGNED_INT_24_8 - Depth 24, stencil 8 (32-bit)
 * @constant {number} TYPE_UNSIGNED_INT_5999 - Packed 5-9-9-9 (32-bit)
 * @constant {number} TYPE_UNSIGNED_INT_101111 - Packed 10-11-11 (32-bit)
 */
export const TYPE_UNSIGNED_BYTE = 1009;
export const TYPE_BYTE = 1010;
export const TYPE_SHORT = 1011;
export const TYPE_UNSIGNED_SHORT = 1012;
export const TYPE_INT = 1013;
export const TYPE_UNSIGNED_INT = 1014;
export const TYPE_FLOAT = 1015;
export const TYPE_HALF_FLOAT = 1016;
export const TYPE_UNSIGNED_SHORT_4444 = 1017;
export const TYPE_UNSIGNED_SHORT_5551 = 1018;
export const TYPE_UNSIGNED_INT_24_8 = 1020;
export const TYPE_UNSIGNED_INT_5999 = 35902;
export const TYPE_UNSIGNED_INT_101111 = 35899;

/**
 * Texture format constants
 * @constant {number} FORMAT_ALPHA - Alpha only
 * @constant {number} FORMAT_RGB - RGB color
 * @constant {number} FORMAT_RGBA - RGBA color
 * @constant {number} FORMAT_DEPTH - Depth buffer
 * @constant {number} FORMAT_DEPTH_STENCIL - Depth and stencil
 * @constant {number} FORMAT_RED - Red channel only
 * @constant {number} FORMAT_RED_INTEGER - Red channel integer
 * @constant {number} FORMAT_RG - Red and green channels
 * @constant {number} FORMAT_RG_INTEGER - Red and green channels integer
 * @constant {number} FORMAT_RGB_INTEGER - RGB integer
 * @constant {number} FORMAT_RGBA_INTEGER - RGBA integer
 */
export const FORMAT_ALPHA = 1021;
export const FORMAT_RGB = 1022;
export const FORMAT_RGBA = 1023;
export const FORMAT_DEPTH = 1026;
export const FORMAT_DEPTH_STENCIL = 1027;
export const FORMAT_RED = 1028;
export const FORMAT_RED_INTEGER = 1029;
export const FORMAT_RG = 1030;
export const FORMAT_RG_INTEGER = 1031;
export const FORMAT_RGB_INTEGER = 1032;
export const FORMAT_RGBA_INTEGER = 1033;

/**
 * Compressed texture format constants
 * S3TC/DXT compression formats
 * @constant {number} FORMAT_RGB_S3TC_DXT1 - RGB DXT1 compression
 * @constant {number} FORMAT_RGBA_S3TC_DXT1 - RGBA DXT1 compression
 * @constant {number} FORMAT_RGBA_S3TC_DXT3 - RGBA DXT3 compression
 * @constant {number} FORMAT_RGBA_S3TC_DXT5 - RGBA DXT5 compression
 */
export const FORMAT_RGB_S3TC_DXT1 = 33776;
export const FORMAT_RGBA_S3TC_DXT1 = 33777;
export const FORMAT_RGBA_S3TC_DXT3 = 33778;
export const FORMAT_RGBA_S3TC_DXT5 = 33779;

/**
 * PVRTC compression formats
 * @constant {number} FORMAT_RGB_PVRTC_4BPPV1 - RGB PVRTC 4 bits per pixel
 * @constant {number} FORMAT_RGB_PVRTC_2BPPV1 - RGB PVRTC 2 bits per pixel
 * @constant {number} FORMAT_RGBA_PVRTC_4BPPV1 - RGBA PVRTC 4 bits per pixel
 * @constant {number} FORMAT_RGBA_PVRTC_2BPPV1 - RGBA PVRTC 2 bits per pixel
 */
export const FORMAT_RGB_PVRTC_4BPPV1 = 35840;
export const FORMAT_RGB_PVRTC_2BPPV1 = 35841;
export const FORMAT_RGBA_PVRTC_4BPPV1 = 35842;
export const FORMAT_RGBA_PVRTC_2BPPV1 = 35843;

/**
 * ETC/EAC compression formats
 * @constant {number} FORMAT_RGB_ETC1 - RGB ETC1 compression
 * @constant {number} FORMAT_RGB_ETC2 - RGB ETC2 compression
 * @constant {number} FORMAT_RGBA_ETC2_EAC - RGBA ETC2 with EAC
 * @constant {number} FORMAT_R11_EAC - Single channel 11-bit EAC
 * @constant {number} FORMAT_SIGNED_R11_EAC - Signed single channel 11-bit EAC
 * @constant {number} FORMAT_RG11_EAC - Two channel 11-bit EAC
 * @constant {number} FORMAT_SIGNED_RG11_EAC - Signed two channel 11-bit EAC
 */
export const FORMAT_RGB_ETC1 = 36196;
export const FORMAT_RGB_ETC2 = 37492;
export const FORMAT_RGBA_ETC2_EAC = 37496;
export const FORMAT_R11_EAC = 37488;
export const FORMAT_SIGNED_R11_EAC = 37489;
export const FORMAT_RG11_EAC = 37490;
export const FORMAT_SIGNED_RG11_EAC = 37491;

/**
 * ASTC compression formats
 * @constant {number} FORMAT_RGBA_ASTC_4x4 - ASTC 4x4 block compression
 * @constant {number} FORMAT_RGBA_ASTC_5x4 - ASTC 5x4 block compression
 * @constant {number} FORMAT_RGBA_ASTC_5x5 - ASTC 5x5 block compression
 * @constant {number} FORMAT_RGBA_ASTC_6x5 - ASTC 6x5 block compression
 * @constant {number} FORMAT_RGBA_ASTC_6x6 - ASTC 6x6 block compression
 * @constant {number} FORMAT_RGBA_ASTC_8x5 - ASTC 8x5 block compression
 * @constant {number} FORMAT_RGBA_ASTC_8x6 - ASTC 8x6 block compression
 * @constant {number} FORMAT_RGBA_ASTC_8x8 - ASTC 8x8 block compression
 * @constant {number} FORMAT_RGBA_ASTC_10x5 - ASTC 10x5 block compression
 * @constant {number} FORMAT_RGBA_ASTC_10x6 - ASTC 10x6 block compression
 * @constant {number} FORMAT_RGBA_ASTC_10x8 - ASTC 10x8 block compression
 * @constant {number} FORMAT_RGBA_ASTC_10x10 - ASTC 10x10 block compression
 * @constant {number} FORMAT_RGBA_ASTC_12x10 - ASTC 12x10 block compression
 * @constant {number} FORMAT_RGBA_ASTC_12x12 - ASTC 12x12 block compression
 */
export const FORMAT_RGBA_ASTC_4x4 = 37808;
export const FORMAT_RGBA_ASTC_5x4 = 37809;
export const FORMAT_RGBA_ASTC_5x5 = 37810;
export const FORMAT_RGBA_ASTC_6x5 = 37811;
export const FORMAT_RGBA_ASTC_6x6 = 37812;
export const FORMAT_RGBA_ASTC_8x5 = 37813;
export const FORMAT_RGBA_ASTC_8x6 = 37814;
export const FORMAT_RGBA_ASTC_8x8 = 37815;
export const FORMAT_RGBA_ASTC_10x5 = 37816;
export const FORMAT_RGBA_ASTC_10x6 = 37817;
export const FORMAT_RGBA_ASTC_10x8 = 37818;
export const FORMAT_RGBA_ASTC_10x10 = 37819;
export const FORMAT_RGBA_ASTC_12x10 = 37820;
export const FORMAT_RGBA_ASTC_12x12 = 37821;

/**
 * BPTC compression formats
 * @constant {number} FORMAT_RGBA_BPTC - RGBA BPTC compression
 * @constant {number} FORMAT_RGB_BPTC_SIGNED - Signed RGB BPTC compression
 * @constant {number} FORMAT_RGB_BPTC_UNSIGNED - Unsigned RGB BPTC compression
 */
export const FORMAT_RGBA_BPTC = 36492;
export const FORMAT_RGB_BPTC_SIGNED = 36494;
export const FORMAT_RGB_BPTC_UNSIGNED = 36495;

/**
 * RGTC compression formats
 * @constant {number} FORMAT_RED_RGTC1 - Single channel RGTC1
 * @constant {number} FORMAT_SIGNED_RED_RGTC1 - Signed single channel RGTC1
 * @constant {number} FORMAT_RED_GREEN_RGTC2 - Two channel RGTC2
 * @constant {number} FORMAT_SIGNED_RED_GREEN_RGTC2 - Signed two channel RGTC2
 */
export const FORMAT_RED_RGTC1 = 36283;
export const FORMAT_SIGNED_RED_RGTC1 = 36284;
export const FORMAT_RED_GREEN_RGTC2 = 36285;
export const FORMAT_SIGNED_RED_GREEN_RGTC2 = 36286;

/**
 * Animation loop constants
 * @constant {number} ANIMATION_LOOP_ONCE - Play animation once
 * @constant {number} ANIMATION_LOOP_REPEAT - Repeat animation
 * @constant {number} ANIMATION_LOOP_PING_PONG - Ping-pong animation
 */
export const ANIMATION_LOOP_ONCE = 2200;
export const ANIMATION_LOOP_REPEAT = 2201;
export const ANIMATION_LOOP_PING_PONG = 2202;

/**
 * Interpolation mode constants
 * @constant {number} INTERPOLATE_DISCRETE - Discrete interpolation
 * @constant {number} INTERPOLATE_LINEAR - Linear interpolation
 * @constant {number} INTERPOLATE_SMOOTH - Smooth interpolation
 */
export const INTERPOLATE_DISCRETE = 2300;
export const INTERPOLATE_LINEAR = 2301;
export const INTERPOLATE_SMOOTH = 2302;

/**
 * Animation ending constants
 * @constant {number} ANIMATION_ENDING_ZERO_CURVATURE - Zero curvature ending
 * @constant {number} ANIMATION_ENDING_ZERO_SLOPE - Zero slope ending
 * @constant {number} ANIMATION_ENDING_WRAP_AROUND - Wrap around ending
 */
export const ANIMATION_ENDING_ZERO_CURVATURE = 2400;
export const ANIMATION_ENDING_ZERO_SLOPE = 2401;
export const ANIMATION_ENDING_WRAP_AROUND = 2402;

/**
 * Animation blend mode constants
 * @constant {number} ANIMATION_BLEND_NORMAL - Normal blend mode
 * @constant {number} ANIMATION_BLEND_ADDITIVE - Additive blend mode
 */
export const ANIMATION_BLEND_NORMAL = 2500;
export const ANIMATION_BLEND_ADDITIVE = 2501;

/**
 * Draw mode constants
 * @constant {number} DRAW_TRIANGLES - Triangles (every 3 vertices)
 * @constant {number} DRAW_TRIANGLE_STRIP - Triangle strip
 * @constant {number} DRAW_TRIANGLE_FAN - Triangle fan
 */
export const DRAW_TRIANGLES = 0;
export const DRAW_TRIANGLE_STRIP = 1;
export const DRAW_TRIANGLE_FAN = 2;

/**
 * Depth packing constants
 * @constant {number} DEPTH_PACKING_BASIC - Basic depth packing
 * @constant {number} DEPTH_PACKING_RGBA - 32-bit RGBA depth packing
 * @constant {number} DEPTH_PACKING_RGB - 24-bit RGB depth packing
 * @constant {number} DEPTH_PACKING_RG - 16-bit RG depth packing
 */
export const DEPTH_PACKING_BASIC = 3200;
export const DEPTH_PACKING_RGBA = 3201;
export const DEPTH_PACKING_RGB = 3202;
export const DEPTH_PACKING_RG = 3203;

/**
 * Normal map constants
 * @constant {number} NORMAL_MAP_TANGENT_SPACE - Tangent space normal map
 * @constant {number} NORMAL_MAP_OBJECT_SPACE - Object space normal map
 */
export const NORMAL_MAP_TANGENT_SPACE = 0;
export const NORMAL_MAP_OBJECT_SPACE = 1;

/**
 * Color space constants
 * @constant {string} COLOR_SPACE_NONE - No color space
 * @constant {string} COLOR_SPACE_SRGB - sRGB color space
 * @constant {string} COLOR_SPACE_LINEAR_SRGB - Linear sRGB color space
 */
export const COLOR_SPACE_NONE = '';
export const COLOR_SPACE_SRGB = 'srgb';
export const COLOR_SPACE_LINEAR_SRGB = 'srgb-linear';

/**
 * Transfer function constants
 * @constant {string} TRANSFER_LINEAR - Linear transfer function
 * @constant {string} TRANSFER_SRGB - sRGB transfer function
 */
export const TRANSFER_LINEAR = 'linear';
export const TRANSFER_SRGB = 'srgb';

/**
 * Normal packing constants
 * @constant {string} NORMAL_PACKING_NONE - No normal packing
 * @constant {string} NORMAL_PACKING_RG - RG normal packing
 * @constant {string} NORMAL_PACKING_GA - GA normal packing
 */
export const NORMAL_PACKING_NONE = '';
export const NORMAL_PACKING_RG = 'rg';
export const NORMAL_PACKING_GA = 'ga';

/**
 * Stencil operation constants
 * @constant {number} STENCIL_OP_ZERO - Set stencil to 0
 * @constant {number} STENCIL_OP_KEEP - Keep current value
 * @constant {number} STENCIL_OP_REPLACE - Replace with reference value
 * @constant {number} STENCIL_OP_INCREMENT - Increment value
 * @constant {number} STENCIL_OP_DECREMENT - Decrement value
 * @constant {number} STENCIL_OP_INCREMENT_WRAP - Increment with wrap
 * @constant {number} STENCIL_OP_DECREMENT_WRAP - Decrement with wrap
 * @constant {number} STENCIL_OP_INVERT - Invert bits
 */
export const STENCIL_OP_ZERO = 0;
export const STENCIL_OP_KEEP = 7680;
export const STENCIL_OP_REPLACE = 7681;
export const STENCIL_OP_INCREMENT = 7682;
export const STENCIL_OP_DECREMENT = 7683;
export const STENCIL_OP_INCREMENT_WRAP = 34055;
export const STENCIL_OP_DECREMENT_WRAP = 34056;
export const STENCIL_OP_INVERT = 5386;

/**
 * Stencil function constants
 * @constant {number} STENCIL_FUNC_NEVER - Never pass
 * @constant {number} STENCIL_FUNC_LESS - Pass if reference < stencil
 * @constant {number} STENCIL_FUNC_EQUAL - Pass if reference = stencil
 * @constant {number} STENCIL_FUNC_LESS_EQUAL - Pass if reference ≤ stencil
 * @constant {number} STENCIL_FUNC_GREATER - Pass if reference > stencil
 * @constant {number} STENCIL_FUNC_NOT_EQUAL - Pass if reference ≠ stencil
 * @constant {number} STENCIL_FUNC_GREATER_EQUAL - Pass if reference ≥ stencil
 * @constant {number} STENCIL_FUNC_ALWAYS - Always pass
 */
export const STENCIL_FUNC_NEVER = 512;
export const STENCIL_FUNC_LESS = 513;
export const STENCIL_FUNC_EQUAL = 514;
export const STENCIL_FUNC_LESS_EQUAL = 515;
export const STENCIL_FUNC_GREATER = 516;
export const STENCIL_FUNC_NOT_EQUAL = 517;
export const STENCIL_FUNC_GREATER_EQUAL = 518;
export const STENCIL_FUNC_ALWAYS = 519;

/**
 * Compare function constants
 * @constant {number} COMPARE_NEVER - Never pass
 * @constant {number} COMPARE_LESS - Pass if less than
 * @constant {number} COMPARE_EQUAL - Pass if equal
 * @constant {number} COMPARE_LESS_EQUAL - Pass if less than or equal
 * @constant {number} COMPARE_GREATER - Pass if greater than
 * @constant {number} COMPARE_NOT_EQUAL - Pass if not equal
 * @constant {number} COMPARE_GREATER_EQUAL - Pass if greater than or equal
 * @constant {number} COMPARE_ALWAYS - Always pass
 */
export const COMPARE_NEVER = 512;
export const COMPARE_LESS = 513;
export const COMPARE_EQUAL = 514;
export const COMPARE_LESS_EQUAL = 515;
export const COMPARE_GREATER = 516;
export const COMPARE_NOT_EQUAL = 517;
export const COMPARE_GREATER_EQUAL = 518;
export const COMPARE_ALWAYS = 519;

/**
 * Buffer usage constants
 * @constant {number} USAGE_STATIC_DRAW - Static draw usage
 * @constant {number} USAGE_DYNAMIC_DRAW - Dynamic draw usage
 * @constant {number} USAGE_STREAM_DRAW - Stream draw usage
 * @constant {number} USAGE_STATIC_READ - Static read usage
 * @constant {number} USAGE_DYNAMIC_READ - Dynamic read usage
 * @constant {number} USAGE_STREAM_READ - Stream read usage
 * @constant {number} USAGE_STATIC_COPY - Static copy usage
 * @constant {number} USAGE_DYNAMIC_COPY - Dynamic copy usage
 * @constant {number} USAGE_STREAM_COPY - Stream copy usage
 */
export const USAGE_STATIC_DRAW = 35044;
export const USAGE_DYNAMIC_DRAW = 35048;
export const USAGE_STREAM_DRAW = 35040;
export const USAGE_STATIC_READ = 35045;
export const USAGE_DYNAMIC_READ = 35049;
export const USAGE_STREAM_READ = 35041;
export const USAGE_STATIC_COPY = 35046;
export const USAGE_DYNAMIC_COPY = 35050;
export const USAGE_STREAM_COPY = 35042;

/**
 * Shader version constants
 * @constant {string} SHADER_VERSION_GLSL1 - GLSL version 1.00
 * @constant {string} SHADER_VERSION_GLSL3 - GLSL version 3.00 ES
 */
export const SHADER_VERSION_GLSL1 = '100';
export const SHADER_VERSION_GLSL3 = '300 es';

/**
 * Coordinate system constants
 * @constant {number} COORDINATE_SYSTEM_WEBGL - WebGL coordinate system
 * @constant {number} COORDINATE_SYSTEM_WEBGPU - WebGPU coordinate system
 */
export const COORDINATE_SYSTEM_WEBGL = 2000;
export const COORDINATE_SYSTEM_WEBGPU = 2001;

/**
 * Timestamp query constants
 * @constant {Object}
 * @property {string} COMPUTE - Compute timestamp query
 * @property {string} RENDER - Render timestamp query
 */
export const TIMESTAMP_QUERY = { COMPUTE: 'compute', RENDER: 'render' };

/**
 * Interpolation sampling type constants
 * @constant {Object}
 * @property {string} PERSPECTIVE - Perspective-correct interpolation
 * @property {string} LINEAR - Linear interpolation
 * @property {string} FLAT - Flat interpolation
 */
export const INTERPOLATION_SAMPLING_TYPE = { PERSPECTIVE: 'perspective', LINEAR: 'linear', FLAT: 'flat' };

/**
 * Interpolation sampling mode constants
 * @constant {Object}
 * @property {string} NORMAL - Normal sampling mode
 * @property {string} CENTROID - Centroid sampling mode
 * @property {string} SAMPLE - Sample-specific mode
 * @property {string} FIRST - Use first vertex
 * @property {string} EITHER - Use either vertex
 */
export const INTERPOLATION_SAMPLING_MODE = { NORMAL: 'normal', CENTROID: 'centroid', SAMPLE: 'sample', FIRST: 'first', EITHER: 'either' };

/**
 * Environment operation constants
 * @constant {number} ENVIRONMENT_OPERATION_MULTIPLY - Multiply environment color
 * @constant {number} ENVIRONMENT_OPERATION_MIX - Mix with reflectivity
 * @constant {number} ENVIRONMENT_OPERATION_ADD - Add environment color
 */
export const ENVIRONMENT_OPERATION_MULTIPLY = 0;
export const ENVIRONMENT_OPERATION_MIX = 1;
export const ENVIRONMENT_OPERATION_ADD = 2;
