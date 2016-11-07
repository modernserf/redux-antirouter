module.exports = {
    "parser": "babel-eslint",
    "extends": "standard",
    "plugins": [
        "standard",
        "promise",
        "import",
        "react",
    ],
    "rules": {
        "indent": ["error", 4],
        "comma-dangle": ["error", "always-multiline"],
        "import/no-unresolved": ["error"],
        "import/named": ["error"],
        "import/default": ["error"],
        "import/namespace": ["error"],
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "react/require-render-return": "error",
        "react/jsx-no-undef":"error",
    }
};
