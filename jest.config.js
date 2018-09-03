module.exports = {
    roots: [
        "<rootDir>/src"
    ],
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    testPathIgnorePatterns: ["/lib/", "/node_modules/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testURL: "http://localhost/",
    collectCoverage: true,
};