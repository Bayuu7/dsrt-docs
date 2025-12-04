/**
 * DSRT Graphics Engine - Texture Utilities
 * @module DSRT/src/textures/TextureUtils.js
 * @version 1.0.0
 * @license MIT
 * @copyright DSRT Engine Team
 */

import { 
    FORMAT_ALPHA, FORMAT_RED, FORMAT_RG, FORMAT_RGB, FORMAT_RGBA,
    FORMAT_RED_INTEGER, FORMAT_RG_INTEGER, FORMAT_RGB_INTEGER, FORMAT_RGBA_INTEGER,
    FORMAT_RGB_S3TC_DXT1, FORMAT_RGBA_S3TC_DXT1, FORMAT_RGBA_S3TC_DXT3, FORMAT_RGBA_S3TC_DXT5,
    FORMAT_RGB_PVRTC_2BPPV1, FORMAT_RGBA_PVRTC_2BPPV1, FORMAT_RGB_PVRTC_4BPPV1, FORMAT_RGBA_PVRTC_4BPPV1,
    FORMAT_RGB_ETC1, FORMAT_RGB_ETC2, FORMAT_RGBA_ETC2_EAC, FORMAT_R11_EAC, FORMAT_SIGNED_R11_EAC,
    FORMAT_RG11_EAC, FORMAT_SIGNED_RG11_EAC,
    FORMAT_RGBA_ASTC_4x4, FORMAT_RGBA_ASTC_5x4, FORMAT_RGBA_ASTC_5x5, FORMAT_RGBA_ASTC_6x5,
    FORMAT_RGBA_ASTC_6x6, FORMAT_RGBA_ASTC_8x5, FORMAT_RGBA_ASTC_8x6, FORMAT_RGBA_ASTC_8x8,
    FORMAT_RGBA_ASTC_10x5, FORMAT_RGBA_ASTC_10x6, FORMAT_RGBA_ASTC_10x8, FORMAT_RGBA_ASTC_10x10,
    FORMAT_RGBA_ASTC_12x10, FORMAT_RGBA_ASTC_12x12,
    FORMAT_RGBA_BPTC, FORMAT_RGB_BPTC_SIGNED, FORMAT_RGB_BPTC_UNSIGNED,
    FORMAT_RED_RGTC1, FORMAT_SIGNED_RED_RGTC1, FORMAT_RED_GREEN_RGTC2, FORMAT_SIGNED_RED_GREEN_RGTC2,
    TYPE_UNSIGNED_BYTE, TYPE_BYTE, TYPE_UNSIGNED_SHORT, TYPE_SHORT, TYPE_HALF_FLOAT,
    TYPE_UNSIGNED_SHORT_4444, TYPE_UNSIGNED_SHORT_5551, TYPE_UNSIGNED_INT, TYPE_INT,
    TYPE_FLOAT, TYPE_UNSIGNED_INT_5999, TYPE_UNSIGNED_INT_101111
} from './Constants.js';

/**
 * Texture fitting strategies for aspect ratio management
 * @namespace TextureFitting
 */

/**
 * Scales texture to fit within target aspect ratio (preserving aspect)
 * Similar to CSS `object-fit: contain`
 * 
 * @memberof TextureFitting
 * @param {Texture} texture - The texture to adjust
 * @param {number} targetRatio - Target aspect ratio (width/height)
 * @returns {Texture} The modified texture
 * @example
 * const texture = new Texture();
 * fitContain(texture, 16/9); // Fit to 16:9 aspect ratio
 */
function fitContain(texture, targetRatio) {
    const img = texture.source;
    const imgRatio = img && img.width ? img.width / img.height : 1;
    
    if (imgRatio > targetRatio) {
        // Image wider than target
        texture.tiling.x = 1;
        texture.tiling.y = imgRatio / targetRatio;
        texture.offset.x = 0;
        texture.offset.y = (1 - texture.tiling.y) * 0.5;
    } else {
        // Image taller than target
        texture.tiling.x = targetRatio / imgRatio;
        texture.tiling.y = 1;
        texture.offset.x = (1 - texture.tiling.x) * 0.5;
        texture.offset.y = 0;
    }
    
    return texture;
}

/**
 * Scales texture to cover target aspect ratio (cropping if needed)
 * Similar to CSS `object-fit: cover`
 * 
 * @memberof TextureFitting
 * @param {Texture} texture - The texture to adjust
 * @param {number} targetRatio - Target aspect ratio (width/height)
 * @returns {Texture} The modified texture
 */
function fitCover(texture, targetRatio) {
    const img = texture.source;
    const imgRatio = img && img.width ? img.width / img.height : 1;
    
    if (imgRatio > targetRatio) {
        // Crop sides (image wider)
        texture.tiling.x = targetRatio / imgRatio;
        texture.tiling.y = 1;
        texture.offset.x = (1 - texture.tiling.x) * 0.5;
        texture.offset.y = 0;
    } else {
        // Crop top/bottom (image taller)
        texture.tiling.x = 1;
        texture.tiling.y = imgRatio / targetRatio;
        texture.offset.x = 0;
        texture.offset.y = (1 - texture.tiling.y) * 0.5;
    }
    
    return texture;
}

/**
 * Stretches texture to fill target (no aspect preservation)
 * Similar to CSS `object-fit: fill`
 * 
 * @memberof TextureFitting
 * @param {Texture} texture - The texture to adjust
 * @returns {Texture} The modified texture
 */
function fitFill(texture) {
    texture.tiling.x = 1;
    texture.tiling.y = 1;
    texture.offset.x = 0;
    texture.offset.y = 0;
    return texture;
}

/**
 * Memory calculation utilities for texture resources
 * @namespace TextureMemory
 */

/**
 * Calculates approximate memory usage for a texture
 * Supports both uncompressed and compressed formats
 * 
 * @memberof TextureMemory
 * @param {number} width - Texture width in pixels
 * @param {number} height - Texture height in pixels
 * @param {number} format - Texture format constant
 * @param {number} type - Texture data type constant
 * @returns {number} Memory size in bytes
 * @throws {Error} If format is unsupported
 * @example
 * const size = calculateTextureSize(1024, 1024, FORMAT_RGBA, TYPE_UNSIGNED_BYTE);
 * console.log(`Texture uses ${size} bytes`); // 4,194,304 bytes
 */
function calculateTextureSize(width, height, format, type) {
    const typeInfo = _getTypeInfo(type);
    
    // Basic uncompressed formats
    switch (format) {
        case FORMAT_ALPHA:
            return width * height;
            
        case FORMAT_RED:
        case FORMAT_RED_INTEGER:
            return Math.ceil((width * height) / typeInfo.components) * typeInfo.byteSize;
            
        case FORMAT_RG:
        case FORMAT_RG_INTEGER:
            return Math.ceil((width * height * 2) / typeInfo.components) * typeInfo.byteSize;
            
        case FORMAT_RGB:
            return Math.ceil((width * height * 3) / typeInfo.components) * typeInfo.byteSize;
            
        case FORMAT_RGBA:
        case FORMAT_RGBA_INTEGER:
            return Math.ceil((width * height * 4) / typeInfo.components) * typeInfo.byteSize;
            
        // Compressed formats - block based calculations
        case FORMAT_RGB_S3TC_DXT1:
        case FORMAT_RGBA_S3TC_DXT1:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 8;
            
        case FORMAT_RGBA_S3TC_DXT3:
        case FORMAT_RGBA_S3TC_DXT5:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 16;
            
        case FORMAT_RGB_PVRTC_2BPPV1:
        case FORMAT_RGBA_PVRTC_2BPPV1:
            return Math.max(width, 16) * Math.max(height, 8) / 4;
            
        case FORMAT_RGB_PVRTC_4BPPV1:
        case FORMAT_RGBA_PVRTC_4BPPV1:
            return Math.max(width, 8) * Math.max(height, 8) / 2;
            
        // ETC/EAC compression
        case FORMAT_RGB_ETC1:
        case FORMAT_RGB_ETC2:
        case FORMAT_R11_EAC:
        case FORMAT_SIGNED_R11_EAC:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 8;
            
        case FORMAT_RGBA_ETC2_EAC:
        case FORMAT_RG11_EAC:
        case FORMAT_SIGNED_RG11_EAC:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 16;
            
        // ASTC compression with various block sizes
        case FORMAT_RGBA_ASTC_4x4:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 16;
        case FORMAT_RGBA_ASTC_5x4:
            return Math.ceil(width / 5) * Math.ceil(height / 4) * 16;
        case FORMAT_RGBA_ASTC_5x5:
            return Math.ceil(width / 5) * Math.ceil(height / 5) * 16;
        case FORMAT_RGBA_ASTC_6x5:
            return Math.ceil(width / 6) * Math.ceil(height / 5) * 16;
        case FORMAT_RGBA_ASTC_6x6:
            return Math.ceil(width / 6) * Math.ceil(height / 6) * 16;
        case FORMAT_RGBA_ASTC_8x5:
            return Math.ceil(width / 8) * Math.ceil(height / 5) * 16;
        case FORMAT_RGBA_ASTC_8x6:
            return Math.ceil(width / 8) * Math.ceil(height / 6) * 16;
        case FORMAT_RGBA_ASTC_8x8:
            return Math.ceil(width / 8) * Math.ceil(height / 8) * 16;
        case FORMAT_RGBA_ASTC_10x5:
            return Math.ceil(width / 10) * Math.ceil(height / 5) * 16;
        case FORMAT_RGBA_ASTC_10x6:
            return Math.ceil(width / 10) * Math.ceil(height / 6) * 16;
        case FORMAT_RGBA_ASTC_10x8:
            return Math.ceil(width / 10) * Math.ceil(height / 8) * 16;
        case FORMAT_RGBA_ASTC_10x10:
            return Math.ceil(width / 10) * Math.ceil(height / 10) * 16;
        case FORMAT_RGBA_ASTC_12x10:
            return Math.ceil(width / 12) * Math.ceil(height / 10) * 16;
        case FORMAT_RGBA_ASTC_12x12:
            return Math.ceil(width / 12) * Math.ceil(height / 12) * 16;
            
        // BPTC compression
        case FORMAT_RGBA_BPTC:
        case FORMAT_RGB_BPTC_SIGNED:
        case FORMAT_RGB_BPTC_UNSIGNED:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 16;
            
        // RGTC compression
        case FORMAT_RED_RGTC1:
        case FORMAT_SIGNED_RED_RGTC1:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 8;
        case FORMAT_RED_GREEN_RGTC2:
        case FORMAT_SIGNED_RED_GREEN_RGTC2:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 16;
            
        default:
            throw new Error(`Unsupported texture format: ${format}`);
    }
}

/**
 * @private
 * Gets byte information for texture data types
 * @param {number} type - Texture type constant
 * @returns {{byteSize: number, components: number}}
 */
function _getTypeInfo(type) {
    switch (type) {
        case TYPE_UNSIGNED_BYTE:
        case TYPE_BYTE:
            return { byteSize: 1, components: 1 };
        case TYPE_UNSIGNED_SHORT:
        case TYPE_SHORT:
        case TYPE_HALF_FLOAT:
            return { byteSize: 2, components: 1 };
        case TYPE_UNSIGNED_SHORT_4444:
        case TYPE_UNSIGNED_SHORT_5551:
            return { byteSize: 2, components: 4 };
        case TYPE_UNSIGNED_INT:
        case TYPE_INT:
        case TYPE_FLOAT:
            return { byteSize: 4, components: 1 };
        case TYPE_UNSIGNED_INT_5999:
        case TYPE_UNSIGNED_INT_101111:
            return { byteSize: 4, components: 3 };
        default:
            throw new Error(`Unknown texture type: ${type}`);
    }
}

/**
 * Main texture utilities class for DSRT Engine
 * @class
 */
class TextureUtilities {
    
    /**
     * Contains texture within target aspect ratio
     * @static
     * @param {Texture} texture - Texture to fit
     * @param {number} targetRatio - Target aspect ratio
     * @returns {Texture}
     */
    static contain(texture, targetRatio) {
        return fitContain(texture, targetRatio);
    }
    
    /**
     * Covers target aspect ratio with texture
     * @static
     * @param {Texture} texture - Texture to fit
     * @param {number} targetRatio - Target aspect ratio
     * @returns {Texture}
     */
    static cover(texture, targetRatio) {
        return fitCover(texture, targetRatio);
    }
    
    /**
     * Fills target with stretched texture
     * @static
     * @param {Texture} texture - Texture to fit
     * @returns {Texture}
     */
    static fill(texture) {
        return fitFill(texture);
    }
    
    /**
     * Calculates texture memory footprint
     * @static
     * @param {number} width - Texture width
     * @param {number} height - Texture height
     * @param {number} format - Texture format
     * @param {number} type - Texture data type
     * @returns {number} Size in bytes
     */
    static getSize(width, height, format, type) {
        return calculateTextureSize(width, height, format, type);
    }
    
    /**
     * Checks if texture format is compressed
     * @static
     * @param {number} format - Texture format constant
     * @returns {boolean}
     */
    static isCompressedFormat(format) {
        return format >= FORMAT_RGB_S3TC_DXT1 && format <= FORMAT_SIGNED_RED_GREEN_RGTC2;
    }
    
    /**
     * Gets recommended mipmap levels for texture
     * @static
     * @param {number} width - Texture width
     * @param {number} height - Texture height
     * @returns {number}
     */
    static getMipmapLevels(width, height) {
        return Math.floor(Math.log2(Math.max(width, height))) + 1;
    }
}

// Export public API
export {
    fitContain,
    fitCover,
    fitFill,
    calculateTextureSize,
    TextureUtilities
};

// Export namespaces for better organization
export {
    TextureFitting,
    TextureMemory
};
