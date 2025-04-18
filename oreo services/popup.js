document.getElementById("swapBtn").addEventListener("click", async () => {
  const find = document.getElementById("find").value;
  const replace = document.getElementById("replace").value;

  if (!find) return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [find, replace],
    func: (findText, replaceText) => {
      const getFormattedReplacement = (match, baseWord) => {
        if (baseWord === baseWord.toLowerCase()) {
          return replaceText.toLowerCase();
        } else if (baseWord === baseWord.toUpperCase()) {
          return replaceText.toUpperCase();
        } else if (
          baseWord[0] === baseWord[0].toUpperCase() &&
          baseWord.slice(1) === baseWord.slice(1).toLowerCase()
        ) {
          return replaceText[0].toUpperCase() + replaceText.slice(1).toLowerCase();
        } else {
          return replaceText;
        }
      };

      const walk = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent = node.textContent.replace(
            new RegExp(findText, "gi"),
            (match) => getFormattedReplacement(match, match)
          );
        } else {
          node.childNodes.forEach(walk);
        }
      };

      walk(document.body);
    },
  });
});
