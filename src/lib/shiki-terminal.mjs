// Custom Shiki theme matching the terminal-green design system.
export default {
  name: "terminal-green",
  type: "dark",
  colors: {
    "editor.background": "#0a0f0b",
    "editor.foreground": "#c9d6cc",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#55655a", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "storage.type",
        "storage.modifier",
        "keyword.control",
        "keyword.operator.new",
        "keyword.operator.expression",
      ],
      settings: { foreground: "#4ade50" },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "punctuation.definition.string",
        "string.template",
      ],
      settings: { foreground: "#e5a44d" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character"],
      settings: { foreground: "#e5c07b" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call.generic",
      ],
      settings: { foreground: "#8fe388" },
    },
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "support.type",
        "support.class",
      ],
      settings: { foreground: "#9be9a8" },
    },
    {
      scope: [
        "variable.other.property",
        "support.type.property-name",
        "meta.object-literal.key",
        "entity.name.tag.yaml",
      ],
      settings: { foreground: "#7ee787" },
    },
    {
      scope: ["variable", "variable.parameter", "variable.other"],
      settings: { foreground: "#c9d6cc" },
    },
    {
      scope: ["punctuation", "meta.brace"],
      settings: { foreground: "#7d8d81" },
    },
    {
      scope: ["keyword.operator"],
      settings: { foreground: "#7d8d81" },
    },
    {
      scope: ["entity.name.tag"],
      settings: { foreground: "#4ade50" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#8fe388" },
    },
    {
      scope: [
        "markup.heading",
        "punctuation.definition.heading",
      ],
      settings: { foreground: "#4ade50" },
    },
  ],
};
