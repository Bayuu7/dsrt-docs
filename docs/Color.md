# DSRT.Color API Reference

## Overview
`DSRT.Color` is the core color class in the DSRT engine.
- Stored as linear RGB in the working color space.
- Accepts hex, CSS strings, X11 names, or another DSRT.Color.
- Provides setters, getters, arithmetic operations, interpolation, and serialization.

## Constructor
```js
const c1 = new DSRT.Color();
const c2 = new DSRT.Color(0xff0000);
const c3 = new DSRT.Color("skyblue");
const c4 = new DSRT.Color(1, 0, 0);
