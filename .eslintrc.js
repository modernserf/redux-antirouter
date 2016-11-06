module.exports = {
    "extends": "standard",
    "plugins": [
        "standard",
        "promise",
        "import",
    ],
    "rules": {
        "indent": ["error", 4],
        "comma-dangle": ["error", "always-multiline"],
        "import/no-unresolved": ["error"],
        "import/named": ["error"],
        "import/default": ["error"],
        "import/namespace": ["error"],
    }
};
