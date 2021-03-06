module.exports.pages = function pages(glyphs) {
    const pages = new Float32Array(glyphs.length * 4 * 1);
    let i = 0;
    glyphs.forEach(function(glyph) {
        const id = glyph.data.page || 0;
        pages[i++] = id;
        pages[i++] = id;
        pages[i++] = id;
        pages[i++] = id;
    });
    return pages;
};

module.exports.attributes = function attributes(glyphs, texWidth, texHeight, flipY) {
    const uvs = new Float32Array(glyphs.length * 4 * 2);
    const positions = new Float32Array(glyphs.length * 4 * 2);
    const centers = new Float32Array(glyphs.length * 4 * 2);

    let i = 0;
    let j = 0;
    let k = 0;

    glyphs.forEach(function(glyph) {
        const bitmap = glyph.data;

        // UV
        const bw = (bitmap.x + bitmap.width);
        const bh = (bitmap.y + bitmap.height);

        // top left position
        const u0 = bitmap.x / texWidth;
        let v1 = bitmap.y / texHeight;
        const u1 = bw / texWidth;
        let v0 = bh / texHeight;

        if (flipY) {
            v1 = (texHeight - bitmap.y) / texHeight;
            v0 = (texHeight - bh) / texHeight;
        }

        // BL
        uvs[i++] = u0;
        uvs[i++] = v1;
        // TL
        uvs[i++] = u0;
        uvs[i++] = v0;
        // TR
        uvs[i++] = u1;
        uvs[i++] = v0;
        // BR
        uvs[i++] = u1;
        uvs[i++] = v1;

        // Positions, Centers

        // bottom left position
        const x = glyph.position[0] + bitmap.xoffset;
        const y = glyph.position[1] + bitmap.yoffset;

        // quad size
        const w = bitmap.width;
        const h = bitmap.height;

        // Position
        // BL
        positions[j++] = x;
        positions[j++] = y;
        // TL
        positions[j++] = x;
        positions[j++] = y + h;
        // TR
        positions[j++] = x + w;
        positions[j++] = y + h;
        // BR
        positions[j++] = x + w;
        positions[j++] = y;

        // Center
        centers[k++] = x + w / 2;
        centers[k++] = y + h / 2;

        centers[k++] = x + w / 2;
        centers[k++] = y + h / 2;

        centers[k++] = x + w / 2;
        centers[k++] = y + h / 2;

        centers[k++] = x + w / 2;
        centers[k++] = y + h / 2;
    });

    return { uvs, positions, centers };
};

module.exports.infos = function infos(glyphs) {
    const lines = new Float32Array(glyphs.length * 4);
    const letters = new Float32Array(glyphs.length * 4);

    let i = 0;
    let j = 0;

    glyphs.forEach(function(glyph) {
        lines[i++] = glyph.line;
        lines[i++] = glyph.line;
        lines[i++] = glyph.line;
        lines[i++] = glyph.line;

        letters[j++] = glyph.index;
        letters[j++] = glyph.index;
        letters[j++] = glyph.index;
        letters[j++] = glyph.index;
    });

    return { lines, letters };
};
