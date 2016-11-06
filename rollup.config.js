import buble from "rollup-plugin-buble"

export default {
    entry: "src/index.js",
    dest: "index.js",
    format: "cjs",
    plugins: [ buble() ],
}
