import { PERSONALITIES } from "../config/personalities.js";

const validIds = new Set(PERSONALITIES.map((p) => p.id));

export default {
  meta: {
    type: "problem",
    messages: {
      invalid: "Invalid personality ID '{{id}}' in questions.js",
    },
    schema: [],
  },

  create(context) {
    return {
      Property(node) {
        if (node.key.type !== "Identifier") return;
        if (node.key.name !== "value") return;

        const valueNode = node.value;
        if (!valueNode || valueNode.type !== "Literal") return;
        if (typeof valueNode.value !== "string") return;

        if (!validIds.has(valueNode.value)) {
          context.report({
            node: valueNode,
            messageId: "invalid",
            data: { id: valueNode.value },
          });
        }
      },
    };
  },
};
