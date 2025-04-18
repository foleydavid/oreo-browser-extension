document.getElementById("swapBtn").addEventListener("click", async () => {
  const find = document.getElementById("find").value;
  const replace = document.getElementById("replace").value;
  const bidirectional = document.getElementById("bidirectional").checked;

  if (!find || !replace) return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [find, replace, bidirectional],
    func: (findText, replaceText, bidirectional) => {
      const formatMatch = (match, replacement) => {
        if (match === match.toLowerCase()) {
          return replacement.toLowerCase();
        } else if (match === match.toUpperCase()) {
          return replacement.toUpperCase();
        } else if (
          match[0] === match[0].toUpperCase() &&
          match.slice(1) === match.slice(1).toLowerCase()
        ) {
          return replacement[0].toUpperCase() + replacement.slice(1).toLowerCase();
        } else {
          return replacement;
        }
      };

      const walk = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          let text = node.textContent;

          if (bidirectional) {
            const TEMP1 = "__SWAP_TEMP_1__";
            const TEMP2 = "__SWAP_TEMP_2__";

            // Step 1: Mark replacements with temporary tokens
            text = text.replace(new RegExp(findText, "gi"), (m) => {
              return TEMP1 + JSON.stringify(m);
            });

            text = text.replace(new RegExp(replaceText, "gi"), (m) => {
              return TEMP2 + JSON.stringify(m);
            });

            // Step 2: Final replacement from temps
            text = text
              .replace(new RegExp(TEMP1 + '"(.*?)"', "g"), (_, m) =>
                formatMatch(m, replaceText)
              )
              .replace(new RegExp(TEMP2 + '"(.*?)"', "g"), (_, m) =>
                formatMatch(m, findText)
              );
          } else {
            // One-way replacement only
            text = text.replace(new RegExp(findText, "gi"), (m) =>
              formatMatch(m, replaceText)
            );
          }

          node.textContent = text;
        } else {
          node.childNodes.forEach(walk);
        }
      };

      walk(document.body);
    },
  });
});
